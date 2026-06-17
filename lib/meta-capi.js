// ─────────────────────────────────────────────────────────────────────────
// Meta Conversions API (CAPI) — server-side event helper.
//
// Why this exists: client-side Meta Pixel is intentionally LIMITED to a
// single PageView on the marketing home (per HHS OCR healthcare tracking
// guidance, audit C-08). All conversion events (Lead, InitiateCheckout)
// fire server-side from this module so health-context URLs never leak
// PHI to Meta's browser-side pixel.
//
// CommonJS to match the rest of /api and /lib in this project (no build
// step; the Vercel Node runtime evaluates these files directly).
//
// Required env vars (set in Vercel + .env.local):
//   META_PIXEL_ID           — public pixel ID, e.g. "1691324572051294"
//   META_CAPI_ACCESS_TOKEN  — server-side token from Events Manager
//                              → Settings → Conversions API → Generate
//   META_CAPI_TEST_CODE     — OPTIONAL test code for verifying events
//                              in Events Manager → Test Events tab.
//                              Leave UNSET in production; setting it in
//                              prod will route all events to the test
//                              channel and skip real attribution.
//
// Privacy: PII (email, phone) is SHA-256 hashed before transmission per
// Meta's CAPI requirements. IP + user-agent are passed as-is (Meta uses
// these for attribution matching; they are not considered PHI in this
// context). Raw email / phone NEVER leave this process unhashed.
// ─────────────────────────────────────────────────────────────────────────

const crypto = require('crypto');

const PIXEL_ID = process.env.META_PIXEL_ID;
const ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN;
const CAPI_URL = PIXEL_ID
  ? `https://graph.facebook.com/v18.0/${PIXEL_ID}/events`
  : null;

function hashSHA256(value) {
  if (!value) return undefined;
  return crypto
    .createHash('sha256')
    .update(String(value).trim().toLowerCase())
    .digest('hex');
}

// Send a single CAPI event. Fire-and-forget by convention — callers
// should NOT await this in a way that blocks the user response.
// Returns a promise that resolves whether the request succeeded or not.
async function sendCAPIEvent(event, testEventCode) {
  if (!ACCESS_TOKEN || !PIXEL_ID) {
    console.warn('[CAPI] Missing META_CAPI_ACCESS_TOKEN or META_PIXEL_ID — skipping');
    return;
  }
  try {
    const body = { data: [event] };
    if (testEventCode) body.test_event_code = testEventCode;

    const res = await fetch(
      `${CAPI_URL}?access_token=${encodeURIComponent(ACCESS_TOKEN)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      }
    );
    if (!res.ok) {
      const err = await res.text();
      console.error('[CAPI] Non-OK response:', res.status, err);
    }
  } catch (err) {
    // Never block the user flow on a CAPI failure
    console.error('[CAPI] Request failed silently:', err && err.message);
  }
}

// Build a Lead event (fired after quiz submit). Email/phone are hashed
// here so callers don't have to think about it.
function buildLeadEvent(params) {
  const ud = {};
  const em = hashSHA256(params.email);
  if (em) ud.em = em;
  const ph = hashSHA256(params.phone);
  if (ph) ud.ph = ph;
  if (params.ipAddress) ud.client_ip_address = params.ipAddress;
  if (params.userAgent) ud.client_user_agent = params.userAgent;
  if (params.fbc) ud.fbc = params.fbc;
  if (params.fbp) ud.fbp = params.fbp;

  return {
    event_name: 'Lead',
    event_time: Math.floor(Date.now() / 1000),
    event_source_url: params.sourceUrl,
    action_source: 'website',
    event_id: params.eventId,
    user_data: ud,
    custom_data: {
      content_name: 'quiz_completion',
      currency: 'USD',
      value: 0
    }
  };
}

// Build an InitiateCheckout event (fired when patient clicks a plan CTA
// on the results page). planValue defaults to the 3-month plan ($477).
function buildInitiateCheckoutEvent(params) {
  const ud = {};
  const em = hashSHA256(params.email);
  if (em) ud.em = em;
  if (params.ipAddress) ud.client_ip_address = params.ipAddress;
  if (params.userAgent) ud.client_user_agent = params.userAgent;
  if (params.fbc) ud.fbc = params.fbc;
  if (params.fbp) ud.fbp = params.fbp;

  return {
    event_name: 'InitiateCheckout',
    event_time: Math.floor(Date.now() / 1000),
    event_source_url: params.sourceUrl,
    action_source: 'website',
    event_id: params.eventId,
    user_data: ud,
    custom_data: {
      currency: 'USD',
      value: typeof params.planValue === 'number' ? params.planValue : 477
    }
  };
}

module.exports = {
  sendCAPIEvent,
  buildLeadEvent,
  buildInitiateCheckoutEvent,
  // Exposed for tests / advanced callers; do NOT use to hash unrelated values.
  hashSHA256
};
