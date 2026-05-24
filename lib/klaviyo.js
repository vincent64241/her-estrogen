// Klaviyo helpers — used by server-side endpoints to fire customer events.
// CommonJS so it works on plain Node runtime (no build step).
//
// Required env vars (set in Vercel + .env.local):
//   KLAVIYO_PRIVATE_KEY    — pk_* private API key (same one used in /api/quiz/submit)

const KLAVIYO_API = 'https://a.klaviyo.com/api';
const KLAVIYO_REVISION = '2024-10-15';

function headers() {
  return {
    Authorization: 'Klaviyo-API-Key ' + process.env.KLAVIYO_PRIVATE_KEY,
    revision: KLAVIYO_REVISION,
    'Content-Type': 'application/json',
    accept: 'application/json'
  };
}

/**
 * Fire a "Placed Order" event to Klaviyo. Drives the new-customer welcome
 * flow, active customer care flow, and revenue dashboards.
 *
 * Now that OpenLoop owns payment processing, OpenLoop's webhook hits
 * /api/orders/placed which calls this helper. The Stripe webhook in
 * api/webhooks/stripe.js is dormant — kept for demo/whitelabel preview only.
 *
 * @param {object} order
 * @param {string} order.email           — customer email (required)
 * @param {number} order.plan_length     — 3, 6, or 12 months
 * @param {string[]} order.products      — array of product names, e.g. ['Estradiol Gel', 'Progesterone Pill']
 * @param {number} order.value           — order value in dollars
 * @param {string} [order.currency]      — defaults to 'USD'
 */
async function firePlacedOrder({ email, plan_length, products, value, currency }) {
  if (!process.env.KLAVIYO_PRIVATE_KEY) {
    throw new Error('KLAVIYO_PRIVATE_KEY is not set');
  }

  const body = {
    data: {
      type: 'event',
      attributes: {
        properties: {
          plan_length: plan_length,
          products: products,
          value: value,
          currency: currency || 'USD'
        },
        metric: {
          data: {
            type: 'metric',
            attributes: { name: 'Placed Order' }
          }
        },
        profile: {
          data: {
            type: 'profile',
            attributes: { email: email }
          }
        }
      }
    }
  };

  const resp = await fetch(KLAVIYO_API + '/events/', {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(body)
  });

  // Klaviyo returns 202 Accepted on success
  if (!resp.ok && resp.status !== 202) {
    const txt = await resp.text().catch(() => '');
    throw new Error('Klaviyo Placed Order ' + resp.status + ' ' + txt.slice(0, 300));
  }

  return { status: resp.status };
}

module.exports = { firePlacedOrder };
