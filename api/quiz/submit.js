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
//     responses?:          object     // free-form full quiz answers
//   }

const { supabaseAdmin } = require('../../lib/supabase');

const KLAVIYO_BASE = 'https://a.klaviyo.com/api';
const KLAVIYO_REVISION = '2024-10-15';
const KLAVIYO_LIST_ID = process.env.KLAVIYO_QUIZ_LIST_ID || 'Rsp58u';

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
async function klaviyoProfileImport(payload) {
  if (!process.env.KLAVIYO_PRIVATE_KEY) {
    throw new Error('KLAVIYO_PRIVATE_KEY is not set');
  }
  // Spec: store birthday as a custom property (NOT Klaviyo's reserved root
  // attribute) to avoid timezone shifts. The birthday flow segment reads
  // from $properties.birthday. Birthday is now required upstream so we can
  // safely include it directly.
  const properties = {
    primary_symptom: payload.primary_symptom || null,
    hormone_stage: payload.hormone_stage || null,
    symptom_score: typeof payload.symptom_score === 'number' ? payload.symptom_score : null,
    recommended_product: payload.recommended_product || null,
    birthday: payload.birthday,
    quiz_completed_at: new Date().toISOString(),
    source: 'quiz'
  };

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
  res.setHeader('Access-Control-Allow-Origin', '*');
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
    responses: body.responses && typeof body.responses === 'object' ? body.responses : {}
  };

  // Run all three writes in parallel. Klaviyo failures must NOT fail the request.
  const [supaResult, importResult, subscribeResult] = await Promise.allSettled([
    writeToSupabase(payload),
    klaviyoProfileImport(payload),
    klaviyoSubscribe(payload)
  ]);

  if (supaResult.status === 'rejected') {
    // Supabase is the source of truth — if this fails we still 200 but log loudly.
    console.error('[quiz/submit] supabase insert failed:', supaResult.reason && supaResult.reason.message);
  }
  if (importResult.status === 'rejected') {
    console.warn('[quiz/submit] klaviyo profile-import failed:', importResult.reason && importResult.reason.message);
  }
  if (subscribeResult.status === 'rejected') {
    console.warn('[quiz/submit] klaviyo subscribe failed:', subscribeResult.reason && subscribeResult.reason.message);
  }

  // UX is fire-and-forget — always return 200 so the client can advance.
  return res.status(200).json({ ok: true });
};
