// Vercel Serverless Function — POST /api/orders/placed
//
// Source-of-truth endpoint for "a customer has paid." Called by OpenLoop's
// webhook (or any future payment processor) when a payment is successfully
// captured. Fires the Klaviyo "Placed Order" event AND updates the profile's
// `current_plan_length` and `product_count` custom properties so Klaviyo
// segments (Active 3/6/12-Month Plan, Single Product Customer, etc.) can
// filter on them.
//
// NOTE: As of this build, Stripe is NO LONGER the payment processor for live
// transactions. The /checkout flow on the site exists only as a whitelabeled
// demo of OpenLoop's processor. The Stripe webhook (api/webhooks/stripe.js)
// is dormant — kept for reference but not wired to real payments.
//
// Required env vars (set in Vercel + .env.local):
//   KLAVIYO_PRIVATE_KEY        — pk_* private API key
//   OPENLOOP_WEBHOOK_SECRET    — shared secret OpenLoop sends in the
//                                X-Webhook-Secret header. Rotate periodically.
//
// Webhook contract (what OpenLoop must POST):
//   Method: POST
//   URL: https://herestrogen.com/api/orders/placed
//   Headers:
//     Content-Type: application/json
//     X-Webhook-Secret: <value of OPENLOOP_WEBHOOK_SECRET>
//   Body:
//     {
//       "email": "customer@example.com",
//       "plan_length": 3 | 6 | 12,
//       "product_count": 1 | 2,            // 1 = single product, 2 = bundle
//       "value": 116,
//       "currency": "USD"                   // optional, defaults to "USD"
//     }
//
// Response:
//   200 { ok: true }                       — event fired + profile updated
//   400 { error: <validation message> }    — bad payload
//   401 { error: 'Unauthorized' }          — missing or wrong webhook secret
//   502 { error: 'Klaviyo event firing failed', detail: ... }

const { firePlacedOrder } = require('../../lib/klaviyo');
const crypto = require('crypto');

// Server-to-server webhook — there is no browser-callable case, so we do
// NOT emit wildcard CORS (audit finding H-01). OpenLoop posts directly
// from its backend with the shared secret in X-Webhook-Secret.
function logToken(email) {
  if (!email) return 'sha-unknown';
  return 'sha-' + crypto.createHash('sha256').update(String(email).toLowerCase()).digest('hex').slice(0, 8);
}

// Sanity cap so absurd `value` payloads can't poison Klaviyo segment math
// (audit finding M-12). $50k is well above the highest 12-month plan price.
const MAX_ORDER_VALUE_USD = 50000;

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Shared-secret auth — keeps random internet traffic from firing fake orders
  // into our Klaviyo flows. Header name is case-insensitive on Vercel/Node.
  const expected = process.env.OPENLOOP_WEBHOOK_SECRET;
  const got = req.headers['x-webhook-secret'];
  if (!expected) {
    console.error('[orders/placed] OPENLOOP_WEBHOOK_SECRET is not set on this deployment');
    return res.status(500).json({ error: 'Server misconfigured' });
  }
  if (got !== expected) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Parse + validate
  const body = req.body || {};
  const email = (body.email || '').trim().toLowerCase();
  const plan_length = body.plan_length;
  const product_count = body.product_count;
  const value = body.value;
  const currency = body.currency || 'USD';

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'A valid email is required.' });
  }
  if (![3, 6, 12].includes(plan_length)) {
    return res.status(400).json({ error: 'plan_length must be 3, 6, or 12.' });
  }
  if (![1, 2].includes(product_count)) {
    return res.status(400).json({ error: 'product_count must be 1 (single product) or 2 (bundle).' });
  }
  if (typeof value !== 'number' || value <= 0) {
    return res.status(400).json({ error: 'value must be a positive number (dollars).' });
  }
  if (value > MAX_ORDER_VALUE_USD) {
    return res.status(400).json({ error: 'value exceeds sanity cap.' });
  }

  // Round to cents to defend against floating-point junk from the caller.
  const safeValue = Math.round(value * 100) / 100;
  const tok = logToken(email);

  // Fire the event + update profile properties. Never let a Klaviyo flake
  // force OpenLoop to retry forever — log loudly on failure but return 502 so
  // OpenLoop knows to retry once if their retry policy supports it.
  try {
    const result = await firePlacedOrder({ email, plan_length, product_count, value: safeValue, currency });
    console.log(`[orders/placed] Klaviyo Placed Order fired for ${tok} (status ${result.status})`);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[orders/placed] Klaviyo fire failed for', tok, ':', err && err.message);
    return res.status(502).json({
      error: 'Klaviyo event firing failed',
      detail: err && err.message
    });
  }
};
