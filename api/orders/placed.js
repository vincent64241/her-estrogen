// Vercel Serverless Function — POST /api/orders/placed
//
// Source-of-truth endpoint for "a customer has paid." Called by OpenLoop's
// webhook (or any future payment processor) when a payment is successfully
// captured. Fires the Klaviyo "Placed Order" event AND updates the profile's
// `current_plan_length` and `product` custom properties so Klaviyo segments
// (Active 3/6/12-Month Plan, Single Product Customer, Complete Protocol
// Customer, etc.) can filter on them.
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
//       "product": "Estradiol Gel"        // single string, NOT an array
//                                          // use "Complete Protocol" for the bundle
//       "value": 116,
//       "currency": "USD"                  // optional, defaults to "USD"
//     }
//
// Response:
//   200 { ok: true }                       — event fired + profile updated
//   400 { error: <validation message> }    — bad payload
//   401 { error: 'Unauthorized' }          — missing or wrong webhook secret
//   502 { error: 'Klaviyo event firing failed', detail: ... }

const { firePlacedOrder } = require('../../lib/klaviyo');

module.exports = async (req, res) => {
  // CORS / preflight
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Webhook-Secret');
  if (req.method === 'OPTIONS') return res.status(204).end();
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
  const product = (body.product || '').toString().trim();
  const value = body.value;
  const currency = body.currency || 'USD';

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'A valid email is required.' });
  }
  if (![3, 6, 12].includes(plan_length)) {
    return res.status(400).json({ error: 'plan_length must be 3, 6, or 12.' });
  }
  if (!product) {
    return res.status(400).json({ error: 'product must be a non-empty string (e.g. "Estradiol Gel" or "Complete Protocol").' });
  }
  if (typeof value !== 'number' || value <= 0) {
    return res.status(400).json({ error: 'value must be a positive number (dollars).' });
  }

  // Fire the event + update profile properties. Never let a Klaviyo flake
  // force OpenLoop to retry forever — log loudly on failure but return 502 so
  // OpenLoop knows to retry once if their retry policy supports it.
  try {
    const result = await firePlacedOrder({ email, plan_length, product, value, currency });
    console.log(`[orders/placed] Klaviyo Placed Order fired for ${email} (status ${result.status})`);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[orders/placed] Klaviyo fire failed:', err && err.message);
    return res.status(502).json({
      error: 'Klaviyo event firing failed',
      detail: err && err.message
    });
  }
};
