// Vercel Serverless Function — POST /api/orders/cancelled
//
// Called by OpenLoop's webhook when a customer cancels their subscription.
// Currently a no-op acknowledger: validate the shared secret, log, return
// 200. OpenLoop owns all customer email (win-back, retention, etc.) — the
// prior Klaviyo "Cancelled Subscription" event has been removed.
//
// Kept live (rather than deleted) so OpenLoop has a stable webhook target.
//
// Required env vars (set in Vercel + .env.local):
//   OPENLOOP_WEBHOOK_SECRET    — shared secret OpenLoop sends in the
//                                X-Webhook-Secret header (same secret as
//                                /api/orders/placed)
//
// Webhook contract (what OpenLoop must POST):
//   Method: POST
//   URL: https://herestrogen.com/api/orders/cancelled
//   Headers:
//     Content-Type: application/json
//     X-Webhook-Secret: <value of OPENLOOP_WEBHOOK_SECRET>
//   Body:
//     {
//       "email": "customer@example.com",
//       "plan_length": 3 | 6 | 12,        // optional but recommended
//       "product_count": 1 | 2,           // optional but recommended
//       "reason": "too_expensive"         // optional; free-form cancel reason
//     }
//
// Response:
//   200 { ok: true }
//   400 { error: <validation message> }
//   401 { error: 'Unauthorized' }

const crypto = require('crypto');

// Server-to-server webhook — no browser-callable case, no wildcard CORS
// (audit finding H-01).
function logToken(email) {
  if (!email) return 'sha-unknown';
  return 'sha-' + crypto.createHash('sha256').update(String(email).toLowerCase()).digest('hex').slice(0, 8);
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const expected = process.env.OPENLOOP_WEBHOOK_SECRET;
  const got = req.headers['x-webhook-secret'];
  if (!expected) {
    console.error('[orders/cancelled] OPENLOOP_WEBHOOK_SECRET is not set on this deployment');
    return res.status(500).json({ error: 'Server misconfigured' });
  }
  if (got !== expected) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const body = req.body || {};
  const email = (body.email || '').trim().toLowerCase();
  const plan_length = body.plan_length;
  const product_count = body.product_count;
  const reason = body.reason ? body.reason.toString().trim() : null;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'A valid email is required.' });
  }
  if (plan_length !== undefined && plan_length !== null && ![3, 6, 12].includes(plan_length)) {
    return res.status(400).json({ error: 'plan_length, if provided, must be 3, 6, or 12.' });
  }
  if (product_count !== undefined && product_count !== null && ![1, 2].includes(product_count)) {
    return res.status(400).json({ error: 'product_count, if provided, must be 1 or 2.' });
  }

  const tok = logToken(email);

  // No-op acknowledge. OpenLoop owns all win-back / retention email.
  console.log(`[orders/cancelled] accepted ${tok} plan=${plan_length} products=${product_count} reason=${reason || 'none'}`);
  return res.status(200).json({ ok: true });
};
