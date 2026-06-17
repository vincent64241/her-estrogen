// Vercel Serverless Function — POST /api/orders/placed
//
// Order-placed webhook receiver. Called by OpenLoop when a payment is
// successfully captured. Currently a no-op acknowledger: we receive,
// validate the shared secret, log the event, and return 200. OpenLoop
// handles all customer email (welcome, receipts, etc.) on their side —
// the prior Klaviyo "Placed Order" event has been removed.
//
// Keeping this endpoint live (rather than deleting it) gives OpenLoop a
// stable webhook target and lets us re-attach analytics/CRM in the future
// without renegotiating the webhook contract.
//
// Required env vars (set in Vercel + .env.local):
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
//       "product_count": 1 | 2,
//       "value": 116,
//       "currency": "USD"                   // optional, defaults to "USD"
//     }
//
// Response:
//   200 { ok: true }                       — event accepted
//   400 { error: <validation message> }    — bad payload
//   401 { error: 'Unauthorized' }          — missing or wrong webhook secret

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

  // No-op acknowledge. OpenLoop owns all downstream customer email +
  // CRM. Log enough to verify webhooks are landing if we need to audit.
  console.log(`[orders/placed] accepted ${tok} plan=${plan_length} products=${product_count} value=$${safeValue} ${currency}`);
  return res.status(200).json({ ok: true });
};
