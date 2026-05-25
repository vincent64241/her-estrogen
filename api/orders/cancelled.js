// Vercel Serverless Function — POST /api/orders/cancelled
//
// Called by OpenLoop's webhook when a customer cancels their subscription.
// Fires the Klaviyo "Cancelled Subscription" event, which is the trigger
// for the win-back flows (F8A/B/C/D) at 30/90/180/360 days.
//
// We deliberately do NOT clear the profile's `current_plan_length` or
// `product_count` properties on cancel — keeping them lets win-back emails
// reference the customer's last plan, and historical segments still resolve
// correctly.
//
// Required env vars (set in Vercel + .env.local):
//   KLAVIYO_PRIVATE_KEY        — pk_* private API key
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
//   502 { error: 'Klaviyo event firing failed', detail: ... }

const { fireCancelledSubscription } = require('../../lib/klaviyo');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Webhook-Secret');
  if (req.method === 'OPTIONS') return res.status(204).end();
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

  try {
    const result = await fireCancelledSubscription({ email, plan_length, product_count, reason });
    console.log(`[orders/cancelled] Klaviyo Cancelled Subscription fired for ${email} (status ${result.status})`);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[orders/cancelled] Klaviyo fire failed:', err && err.message);
    return res.status(502).json({
      error: 'Klaviyo event firing failed',
      detail: err && err.message
    });
  }
};
