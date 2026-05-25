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

// Internal: post an event to /api/events/.
async function postEvent({ metricName, eventProperties, email, profileProperties }) {
  if (!process.env.KLAVIYO_PRIVATE_KEY) {
    throw new Error('KLAVIYO_PRIVATE_KEY is not set');
  }
  const profileAttrs = { email };
  if (profileProperties && Object.keys(profileProperties).length > 0) {
    profileAttrs.properties = profileProperties;
  }
  const body = {
    data: {
      type: 'event',
      attributes: {
        properties: eventProperties || {},
        metric: { data: { type: 'metric', attributes: { name: metricName } } },
        profile: { data: { type: 'profile', attributes: profileAttrs } }
      }
    }
  };
  const resp = await fetch(KLAVIYO_API + '/events/', {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(body)
  });
  if (!resp.ok && resp.status !== 202) {
    const txt = await resp.text().catch(() => '');
    throw new Error('Klaviyo ' + metricName + ' ' + resp.status + ' ' + txt.slice(0, 300));
  }
  return { status: resp.status };
}

/**
 * Fire a "Placed Order" event to Klaviyo AND update the profile's custom
 * properties (`current_plan_length`, `product_count`) so segments can use them.
 *
 * Drives the new-customer welcome flow (F3), active customer care (F4), and
 * plan-upgrade flows (F5A/B).
 *
 * @param {object} order
 * @param {string} order.email           — customer email (required)
 * @param {number} order.plan_length     — 3, 6, or 12 months (required)
 * @param {number} order.product_count   — 1 for single product, 2 for bundle (required)
 * @param {number} order.value           — order value in dollars (required)
 * @param {string} [order.currency]      — defaults to 'USD'
 */
async function firePlacedOrder({ email, plan_length, product_count, value, currency }) {
  return postEvent({
    metricName: 'Placed Order',
    eventProperties: {
      plan_length: plan_length,
      product_count: product_count,
      value: value,
      currency: currency || 'USD'
    },
    email: email,
    // Persist these on the profile so segments like "Active 3-Month Plan" and
    // "Single Product Customer" can filter by them.
    profileProperties: {
      current_plan_length: plan_length,
      product_count: product_count
    }
  });
}

/**
 * Fire a "Cancelled Subscription" event to Klaviyo. Drives the win-back
 * flows (F8A/B/C/D). Profile properties are NOT updated on cancellation —
 * we keep `current_plan_length` and `product_count` intact so historical
 * segments still work. Klaviyo's churn segments use the event timestamp.
 *
 * @param {object} cancel
 * @param {string} cancel.email           — customer email (required)
 * @param {number} [cancel.plan_length]   — 3, 6, or 12 (whatever plan they were on)
 * @param {number} [cancel.product_count] — 1 or 2
 * @param {string} [cancel.reason]        — free-form cancel reason if available
 */
async function fireCancelledSubscription({ email, plan_length, product_count, reason }) {
  return postEvent({
    metricName: 'Cancelled Subscription',
    eventProperties: {
      plan_length: plan_length || null,
      product_count: product_count || null,
      reason: reason || null
    },
    email: email
  });
}

module.exports = { firePlacedOrder, fireCancelledSubscription };
