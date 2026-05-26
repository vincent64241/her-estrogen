// Vercel Serverless Function — POST /api/quiz/submit
//
// Captures a completed quiz on the server and fans out to:
//   (a) Supabase quiz_responses (canonical record — survives Klaviyo outages)
//   (b) Klaviyo profile-import (creates/updates the profile)
//   (c) Klaviyo bulk subscribe (opts the profile into list Rsp58u)
//
// Klaviyo writes are fire-and-forget (Promise.allSettled). The UX never waits
// on a Klaviyo failure — we always return 200 { ok: true } once Supabase
// succeeds. Klaviyo errors are logged for the operator.
//
// COMPLIANCE LOCKS (do not loosen without legal review):
//   - Never accept or echo "menopause", "HRT", or "hormone replacement
//     therapy" in event payloads sent to Klaviyo. The recommended_product
//     and primary_symptom fields are passed through verbatim — make sure
//     the quiz client never puts those strings into them.
//   - HEALTH-DATA GATING (audit finding C-09): The KLAVIYO_SEND_HEALTH_DATA
//     env var mirrors the client-side compliance flag. While Klaviyo's BAA
//     status is unconfirmed, this MUST be left unset / falsy. In that state
//     the Klaviyo profile-import receives only email + first_name + a
//     generic `source` and `quiz_completed_at` — NO symptom data, NO
//     hormone stage, NO recommended product, NO birthday. Supabase (the
//     marketing-side store of record) still gets the full payload.
//   - Do NOT send full name, DOB, address, phone, or any prescribing data
//     to Klaviyo. Only the fields listed in the request body below.
//   - Event types fired by the Meta Pixel (client-side, not this endpoint):
//     PageView, Lead, CompleteRegistration, InitiateCheckout. NO Purchase
//     events. NO custom medical events.
//
// Required env vars (set in Vercel → Settings → Environment Variables):
//   NEXT_PUBLIC_SUPABASE_URL           — Supabase project URL
//   SUPABASE_SERVICE_ROLE_KEY          — Supabase service-role secret
//   KLAVIYO_PRIVATE_KEY                — pk_* private API key
//   KLAVIYO_QUIZ_LIST_ID               — defaults to 'Rsp58u' if unset
//   KLAVIYO_SEND_HEALTH_DATA           — set to 'true' ONLY after a Klaviyo BAA is signed
//   ALLOWED_ORIGIN                     — comma-separated list; defaults to herestrogen.com
//
// Request body (JSON):
//   {
//     email:               string,    // required, validated below
//     firstName?:          string,
//     primary_symptom?:    string,
//     hormone_stage?:      string,
//     symptom_score?:      number,
//     recommended_product?: string,
//     birthday:            string,    // REQUIRED — ISO YYYY-MM-DD (clinical intake)
//     responses?:          object     // free-form full quiz answers (allowlist-filtered server side)
//   }

const { supabaseAdmin } = require('../../lib/supabase');
const { fireCompletedQuiz } = require('../../lib/klaviyo');
const crypto = require('crypto');

const KLAVIYO_BASE = 'https://a.klaviyo.com/api';
const KLAVIYO_REVISION = '2024-10-15';
const KLAVIYO_LIST_ID = process.env.KLAVIYO_QUIZ_LIST_ID || 'Rsp58u';

// CORS — pin to the production origin(s). Configurable via ALLOWED_ORIGIN env
// (comma-separated). Vercel preview URLs can be added per-deployment.
const ALLOWED_ORIGINS = new Set(
  (process.env.ALLOWED_ORIGIN || 'https://herestrogen.com,https://www.herestrogen.com')
    .split(',').map(s => s.trim()).filter(Boolean)
);

// HEALTH-DATA TOGGLE: must be the literal string 'true' to enable. Anything else = OFF.
const KLAVIYO_SEND_HEALTH_DATA = process.env.KLAVIYO_SEND_HEALTH_DATA === 'true';

// Hash an email to a short token for non-PHI server logs (audit finding H-03).
// Format: "sha-<8 hex chars>" — enough to correlate retries without re-emitting the email.
function logToken(email) {
  if (!email) return 'sha-unknown';
  return 'sha-' + crypto.createHash('sha256').update(String(email).toLowerCase()).digest('hex').slice(0, 8);
}

// Allowlist of keys that may flow through `responses` JSONB into Supabase
// (audit finding M-03). Anything off the list is silently stripped so an
// attacker (or a future quiz UI bug) can't smuggle unexpected fields into
// the canonical store. Keep in sync with the quiz client (`quiz.html`).
const RESPONSES_ALLOWED_KEYS = new Set([
  'stage',
  'symptoms',
  'tried',
  'preference',
  'firstName',
  'email',
  'phone',
  'birthday'
]);

function sanitizeResponses(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return {};
  const out = {};
  for (const key of Object.keys(input)) {
    if (RESPONSES_ALLOWED_KEYS.has(key)) {
      out[key] = input[key];
    }
  }
  return out;
}

// Validate the REQUIRED birthday field on the API contract.
// Birthday is required because OpenLoop's clinical intake needs DOB to
// verify candidacy. Missing or empty values throw → caller returns 400.
// Accepts: 'YYYY-MM-DD' that is a real calendar date AND year between
//          1940-01-01 and (today - 21 years) → valid (returns ISO string)
function parseBirthday(raw) {
  if (raw == null || raw === '') throw new Error('birthday is required');
  if (typeof raw !== 'string') throw new Error('birthday must be a string YYYY-MM-DD');
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw);
  if (!m) throw new Error('birthday must be in YYYY-MM-DD format');
  const yi = parseInt(m[1], 10), mi = parseInt(m[2], 10), di = parseInt(m[3], 10);
  const minYear = 1940;
  const maxYear = new Date().getFullYear() - 21;
  if (yi < minYear || yi > maxYear) throw new Error('birthday year out of range');
  const dt = new Date(yi, mi - 1, di);
  if (dt.getFullYear() !== yi || dt.getMonth() !== mi - 1 || dt.getDate() !== di) {
    throw new Error('birthday is not a real date');
  }
  return raw;
}

// Build the headers Klaviyo expects on every request.
function klaviyoHeaders() {
  return {
    Authorization: 'Klaviyo-API-Key ' + process.env.KLAVIYO_PRIVATE_KEY,
    revision: KLAVIYO_REVISION,
    'Content-Type': 'application/json',
    accept: 'application/json'
  };
}

// (a) Insert the quiz response into Supabase. Returns the inserted row or throws.
//     NOTE: requires the `birthday DATE` column on quiz_responses — apply migration
//     `ALTER TABLE quiz_responses ADD COLUMN birthday DATE;` before using.
async function writeToSupabase(payload) {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client is not configured (missing URL or SERVICE_ROLE_KEY)');
  }
  const { data, error } = await supabaseAdmin
    .from('quiz_responses')
    .insert({
      responses: payload.responses || {},
      primary_symptom: payload.primary_symptom || null,
      hormone_stage: payload.hormone_stage || null,
      symptom_score: typeof payload.symptom_score === 'number' ? payload.symptom_score : null,
      recommended_product: payload.recommended_product || null,
      birthday: payload.birthday || null
      // submitted_at defaults to NOW() in the table schema
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// (b) Klaviyo profile-import — creates or updates the profile by email.
//
// COMPLIANCE LOCK (C-09 fix): When KLAVIYO_SEND_HEALTH_DATA is OFF (default),
// we send ONLY email + first_name + non-PHI marketing breadcrumbs to Klaviyo.
// No symptom, no hormone stage, no recommended product, no birthday. This
// preserves the marketing-vs-clinical boundary while the Klaviyo BAA status
// is unconfirmed.
async function klaviyoProfileImport(payload) {
  if (!process.env.KLAVIYO_PRIVATE_KEY) {
    throw new Error('KLAVIYO_PRIVATE_KEY is not set');
  }

  let properties;
  if (KLAVIYO_SEND_HEALTH_DATA) {
    // BAA-on path — DO NOT enable without a written, signed Klaviyo BAA.
    properties = {
      primary_symptom: payload.primary_symptom || null,
      hormone_stage: payload.hormone_stage || null,
      symptom_score: typeof payload.symptom_score === 'number' ? payload.symptom_score : null,
      recommended_product: payload.recommended_product || null,
      birthday: payload.birthday,
      quiz_completed_at: new Date().toISOString(),
      source: 'quiz'
    };
  } else {
    // BAA-off path — strip every health-context field. Klaviyo gets the
    // bare minimum needed for transactional comms.
    properties = {
      quiz_completed_at: new Date().toISOString(),
      source: 'quiz'
    };
  }

  const body = {
    data: {
      type: 'profile',
      attributes: {
        email: payload.email,
        first_name: payload.firstName || null,
        properties
      }
    }
  };
  const resp = await fetch(KLAVIYO_BASE + '/profile-import/', {
    method: 'POST',
    headers: klaviyoHeaders(),
    body: JSON.stringify(body)
  });
  if (!resp.ok && resp.status !== 202) {
    const txt = await resp.text().catch(() => '');
    throw new Error('profile-import ' + resp.status + ' ' + txt.slice(0, 300));
  }
  return { status: resp.status };
}

// (c) Klaviyo bulk-subscribe — opts the profile into list KLAVIYO_LIST_ID.
async function klaviyoSubscribe(payload) {
  if (!process.env.KLAVIYO_PRIVATE_KEY) {
    throw new Error('KLAVIYO_PRIVATE_KEY is not set');
  }
  const body = {
    data: {
      type: 'profile-subscription-bulk-create-job',
      attributes: {
        profiles: {
          data: [{
            type: 'profile',
            attributes: {
              email: payload.email,
              subscriptions: { email: { marketing: { consent: 'SUBSCRIBED' } } }
            }
          }]
        }
      },
      relationships: {
        list: { data: { type: 'list', id: KLAVIYO_LIST_ID } }
      }
    }
  };
  const resp = await fetch(KLAVIYO_BASE + '/profile-subscription-bulk-create-jobs/', {
    method: 'POST',
    headers: klaviyoHeaders(),
    body: JSON.stringify(body)
  });
  if (!resp.ok && resp.status !== 202) {
    const txt = await resp.text().catch(() => '');
    throw new Error('subscribe ' + resp.status + ' ' + txt.slice(0, 300));
  }
  return { status: resp.status };
}

module.exports = async (req, res) => {
  // CORS — pinned origin allow-list (audit finding H-01).
  const origin = req.headers['origin'] || '';
  if (ALLOWED_ORIGINS.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = req.body || {};
  const email = (body.email || '').trim().toLowerCase();

  // Strict email validation — reject 400 if missing or malformed
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'A valid email is required.' });
  }

  // Validate optional birthday before kicking off any writes. A bad birthday
  // returns 400 — but null/missing is fully allowed.
  let birthday;
  try {
    birthday = parseBirthday(body.birthday);
  } catch (err) {
    return res.status(400).json({ error: 'Invalid birthday: ' + err.message });
  }

  const payload = {
    email,
    firstName: (body.firstName || '').toString().trim() || null,
    primary_symptom: body.primary_symptom || null,
    hormone_stage: body.hormone_stage || null,
    symptom_score: typeof body.symptom_score === 'number' ? body.symptom_score : null,
    recommended_product: body.recommended_product || null,
    birthday,
    responses: sanitizeResponses(body.responses)
  };

  const tok = logToken(email);

  // Run all four writes in parallel. Klaviyo failures must NOT fail the request.
  //   - writeToSupabase: canonical record
  //   - klaviyoProfileImport: create/update profile (health data gated by KLAVIYO_SEND_HEALTH_DATA)
  //   - klaviyoSubscribe: add to list Rsp58u (triggers F2 Pre-Rx Nurture)
  //   - fireCompletedQuiz: fires "Completed Quiz" metric event (EXIT signal
  //     for F1 Quiz Abandonment — stops the F1 flow from sending abandonment
  //     emails when the user actually completes within the 1hr window)
  const [supaResult, importResult, subscribeResult, completedResult] = await Promise.allSettled([
    writeToSupabase(payload),
    klaviyoProfileImport(payload),
    klaviyoSubscribe(payload),
    fireCompletedQuiz({ email })
  ]);

  if (supaResult.status === 'rejected') {
    console.error('[quiz/submit] supabase insert failed for', tok, ':', supaResult.reason && supaResult.reason.message);
  }
  if (importResult.status === 'rejected') {
    console.warn('[quiz/submit] klaviyo profile-import failed for', tok, ':', importResult.reason && importResult.reason.message);
  }
  if (subscribeResult.status === 'rejected') {
    console.warn('[quiz/submit] klaviyo subscribe failed for', tok, ':', subscribeResult.reason && subscribeResult.reason.message);
  }
  if (completedResult.status === 'rejected') {
    console.warn('[quiz/submit] klaviyo Completed Quiz event failed for', tok, ':', completedResult.reason && completedResult.reason.message);
  }

  // UX is fire-and-forget — always return 200 so the client can advance.
  return res.status(200).json({ ok: true });
};
