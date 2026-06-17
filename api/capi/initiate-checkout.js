// ─────────────────────────────────────────────────────────────────────────
// POST /api/capi/initiate-checkout
//
// Server-side Meta Conversions API InitiateCheckout event. Client (results
// page CTA) fires a fire-and-forget POST here BEFORE redirecting to the
// Stripe-hosted checkout. We extract IP + UA from request headers, hash
// email via lib/meta-capi, and forward to Meta's CAPI endpoint.
//
// Always returns 200 { ok: true } — never surface errors to the client,
// since this is a non-critical attribution event that must not block
// checkout flow.
//
// Body shape:
//   { email?: string, fbc?: string, fbp?: string, planValue?: number }
// ─────────────────────────────────────────────────────────────────────────

const { sendCAPIEvent, buildInitiateCheckoutEvent } = require('../../lib/meta-capi');

// CORS allow-list — same origins as /api/quiz/submit.
const ALLOWED_ORIGINS = new Set(
  (process.env.ALLOWED_ORIGIN || 'https://herestrogen.com,https://www.herestrogen.com')
    .split(',').map(function (s) { return s.trim(); }).filter(Boolean)
);

module.exports = async (req, res) => {
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
    // Never surface errors — return 200 even on bad method, to keep
    // checkout flow uninterrupted regardless of attribution status.
    return res.status(200).json({ ok: true });
  }

  try {
    const body = req.body || {};

    const ipAddress =
      (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
      req.headers['x-real-ip'] ||
      undefined;
    const userAgent = req.headers['user-agent'] || undefined;

    const eventId = `ic_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

    await sendCAPIEvent(
      buildInitiateCheckoutEvent({
        email: body.email || undefined,
        ipAddress,
        userAgent,
        fbc: body.fbc || undefined,
        fbp: body.fbp || undefined,
        sourceUrl: 'https://www.herestrogen.com/results',
        planValue: typeof body.planValue === 'number' ? body.planValue : 477,
        eventId
      }),
      process.env.META_CAPI_TEST_CODE
    );

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[CAPI] /api/capi/initiate-checkout failed:', err && err.message);
    // Never surface errors to the client.
    return res.status(200).json({ ok: true });
  }
};
