// Vercel Serverless Function — POST /api/webhooks/stripe
// Receives Stripe webhook events, verifies signature, and writes to Supabase.
//
// Required env vars:
//   STRIPE_SECRET_KEY
//   STRIPE_WEBHOOK_SECRET
//   NEXT_PUBLIC_SUPABASE_URL
//   SUPABASE_SERVICE_ROLE_KEY

const Stripe = require('stripe');
const {
  createPatient,
  createPrescription,
  getPatientByStripeCustomerId,
  getPatientBySubscriptionId,
  updatePatientStatus
} = require('../../lib/database');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20'
});

// Read raw body — required for Stripe signature verification.
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

  // Each branch tolerates DB errors and still returns 200 so Stripe doesn't
  // retry the event forever. Errors are logged for investigation.
  try {
    switch (event.type) {

      // ─── Patient pays → create patient + prescription rows ───
      case 'checkout.session.completed': {
        const session = event.data.object;

        // Pull customer details from Stripe (session itself has limited info)
        let customer = null;
        if (session.customer) {
          try {
            customer = await stripe.customers.retrieve(session.customer);
          } catch (e) {
            console.warn('[stripe] could not retrieve customer:', e.message);
          }
        }

        const email = (customer && customer.email)
          || (session.customer_details && session.customer_details.email);
        const fullName = (customer && customer.name)
          || (session.customer_details && session.customer_details.name)
          || 'Her Estrogen Patient';
        const phone = (customer && customer.phone)
          || (session.customer_details && session.customer_details.phone)
          || null;

        if (!email) {
          console.warn('[stripe] checkout.session.completed had no email; skipping DB write');
          break;
        }

        // Pull metadata stamped by /api/checkout.js
        const md = session.metadata || {};
        const subMd = (session.subscription_data && session.subscription_data.metadata) || {};
        const meta = { ...subMd, ...md };

        const patient = await createPatient({
          email,
          full_name: fullName,
          phone,
          address_line1: meta.shipping_line1 || null,
          address_line2: meta.shipping_line2 || null,
          city: meta.shipping_city || null,
          state: meta.shipping_state || null,
          zip_code: meta.shipping_zip || null,
          stripe_customer_id: session.customer || null,
          stripe_subscription_id: session.subscription || null,
          stripe_price_id: meta.priceId || null,
          product_name: meta.productName || meta.product || null,
          billing_period: meta.billingPeriod || meta.period || null,
          monthly_amount: session.amount_total || 0
        });

        await createPrescription({
          patient_id: patient.id,
          medication_name: meta.productName || meta.product || 'HRT Protocol',
          instructions: 'Apply as directed by your licensed Her Estrogen provider.'
        });

        console.log(`[stripe→supabase] patient + prescription created for ${email}`);
        break;
      }

      // ─── Subscription created → mark patient active + set billing dates ───
      case 'customer.subscription.created': {
        const sub = event.data.object;
        const patient = await getPatientByStripeCustomerId(sub.customer);
        if (patient) {
          await updatePatientStatus(patient.id, 'active', {
            subscription_started_at: new Date().toISOString(),
            next_billing_date: sub.current_period_end
              ? new Date(sub.current_period_end * 1000).toISOString()
              : null
          });
          console.log(`[stripe→supabase] patient activated: ${patient.email}`);
        } else {
          console.warn(`[stripe→supabase] no patient found for customer ${sub.customer}`);
        }
        break;
      }

      // ─── Subscription updated (pause / plan change / etc.) ───
      case 'customer.subscription.updated': {
        const sub = event.data.object;
        const patient = await getPatientBySubscriptionId(sub.id);
        if (patient) {
          const newStatus = sub.pause_collection
            ? 'paused'
            : (sub.status === 'active' ? 'active' : patient.status);
          await updatePatientStatus(patient.id, newStatus, {
            next_billing_date: sub.current_period_end
              ? new Date(sub.current_period_end * 1000).toISOString()
              : null
          });
          console.log(`[stripe→supabase] patient ${patient.email} → ${newStatus}`);
        }
        break;
      }

      // ─── Subscription cancelled ───
      case 'customer.subscription.deleted': {
        const sub = event.data.object;
        const patient = await getPatientBySubscriptionId(sub.id);
        if (patient) {
          await updatePatientStatus(patient.id, 'cancelled', {
            subscription_cancelled_at: new Date().toISOString()
          });
          console.log(`[stripe→supabase] patient cancelled: ${patient.email}`);
        }
        break;
      }

      // ─── Refill paid → roll forward next billing date ───
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        // Only act on recurring renewals, not the initial checkout invoice
        if (invoice.billing_reason === 'subscription_cycle' && invoice.subscription) {
          const patient = await getPatientByStripeCustomerId(invoice.customer);
          if (patient) {
            const sub = await stripe.subscriptions.retrieve(invoice.subscription);
            await updatePatientStatus(patient.id, 'active', {
              next_billing_date: sub.current_period_end
                ? new Date(sub.current_period_end * 1000).toISOString()
                : null
            });
            console.log(`[stripe→supabase] refill recorded: ${patient.email}`);
          }
        }
        break;
      }

      // ─── Payment failed — log; downstream system handles dunning ───
      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        const patient = await getPatientByStripeCustomerId(invoice.customer);
        if (patient) {
          console.warn(`[stripe→supabase] payment failed: ${patient.email}`);
          // TODO: send "update your card" email via Postmark/Resend
        }
        break;
      }

      // payment_intent.* — kept for completeness; subscription flow already handles via invoice events
      case 'payment_intent.succeeded':
      case 'payment_intent.payment_failed':
        // logged only
        console.log(`[stripe] ${event.type}: ${event.data.object.id}`);
        break;

      default:
        console.log('[stripe] unhandled event type:', event.type);
    }
  } catch (handlerErr) {
    // Log + ack — don't 500, Stripe will retry forever otherwise
    console.error('[stripe→supabase] handler error (acking anyway):', handlerErr);
  }

  return res.status(200).json({ received: true });
};

// Disable Vercel's default body parsing so we can read the raw stream
// for Stripe signature verification.
module.exports.config = {
  api: { bodyParser: false }
};
