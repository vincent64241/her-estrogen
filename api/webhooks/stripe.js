// Vercel Serverless Function — POST /api/webhooks/stripe
// Receives Stripe webhook events, verifies signature, and handles:
//   - checkout.session.completed
//   - customer.subscription.created
//   - customer.subscription.updated
//   - customer.subscription.deleted
//   - invoice.payment_succeeded
//   - invoice.payment_failed
//   (+ payment_intent.* kept for completeness)
//
// Required env vars:
//   STRIPE_SECRET_KEY        sk_test_... or sk_live_...
//   STRIPE_WEBHOOK_SECRET    whsec_... (Stripe Dashboard → Webhooks → Signing secret)

const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20'
});

// Read raw request body — required for Stripe signature verification.
function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end();
  }

  const sig = req.headers['stripe-signature'];
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !secret) {
    console.error('Webhook missing signature or secret');
    return res.status(400).send('Missing signature or webhook secret');
  }

  let event;
  try {
    const rawBody = await readRawBody(req);
    event = stripe.webhooks.constructEvent(rawBody, sig, secret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Each branch logs the key fields and leaves a TODO for downstream business
  // logic (DB writes, transactional emails, provider task creation, etc.).
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        console.log('[stripe] checkout.session.completed', {
          id: session.id,
          customer: session.customer,
          email: session.customer_details && session.customer_details.email,
          amount_total: session.amount_total,
          subscription: session.subscription,
          product: session.metadata && session.metadata.product
        });
        // TODO: send intake to OpenLoop; trigger welcome email via Resend/Postmark
        break;
      }

      case 'customer.subscription.created': {
        const sub = event.data.object;
        console.log('[stripe] customer.subscription.created', {
          id: sub.id,
          customer: sub.customer,
          status: sub.status,
          priceId: sub.items.data[0] && sub.items.data[0].price.id
        });
        // TODO: provision patient portal access; create provider review task;
        //       schedule 30-day check-in
        break;
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object;
        const prev = event.data.previous_attributes || {};
        console.log('[stripe] customer.subscription.updated', {
          id: sub.id,
          status: sub.status,
          cancel_at_period_end: sub.cancel_at_period_end,
          previous_status: prev.status
        });
        // TODO: handle past_due/cancellation/plan-change downstream
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object;
        console.log('[stripe] customer.subscription.deleted', {
          id: sub.id,
          customer: sub.customer
        });
        // TODO: revoke portal access; trigger win-back sequence
        break;
      }

      case 'invoice.payment_succeeded': {
        const inv = event.data.object;
        console.log('[stripe] invoice.payment_succeeded', {
          id: inv.id,
          customer: inv.customer,
          subscription: inv.subscription,
          amount_paid: inv.amount_paid
        });
        // TODO: trigger pharmacy refill order; send receipt
        break;
      }

      case 'invoice.payment_failed': {
        const inv = event.data.object;
        console.log('[stripe] invoice.payment_failed', {
          id: inv.id,
          customer: inv.customer,
          attempt_count: inv.attempt_count,
          next_payment_attempt: inv.next_payment_attempt
        });
        // TODO: send payment failure email with update-card link
        break;
      }

      case 'payment_intent.succeeded': {
        const pi = event.data.object;
        console.log('[stripe] payment_intent.succeeded', {
          id: pi.id,
          amount: pi.amount,
          customer: pi.customer
        });
        break;
      }

      case 'payment_intent.payment_failed': {
        const pi = event.data.object;
        console.warn('[stripe] payment_intent.payment_failed', {
          id: pi.id,
          reason: pi.last_payment_error && pi.last_payment_error.message
        });
        break;
      }

      default:
        console.log('[stripe] unhandled event type:', event.type);
    }
  } catch (handlerErr) {
    // Don't 500 — Stripe will retry. Log and ack so we don't churn the queue.
    console.error('[stripe] handler error (acking anyway):', handlerErr);
  }

  return res.status(200).json({ received: true });
};

// Disable Vercel's default body parsing so we can read the raw stream
// for Stripe signature verification.
module.exports.config = {
  api: { bodyParser: false }
};
