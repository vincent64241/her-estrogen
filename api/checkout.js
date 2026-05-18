// Vercel Serverless Function — POST /api/checkout
// Creates a Stripe Checkout Session in subscription mode and returns the
// hosted-page URL. Client redirects to that URL; Stripe collects card,
// handles 3DS/Apple Pay/Google Pay/Klarna, then redirects to success_url.
//
// Required env vars (set in Vercel → Settings → Environment Variables):
//   STRIPE_SECRET_KEY
//   NEXT_PUBLIC_BASE_URL              (e.g. https://her-estrogen.vercel.app)
//   NEXT_PUBLIC_STRIPE_PRICE_*        (20 price IDs — see .env.local)
//
// Request body:
//   {
//     product: 'completeProtocol' | 'estradiolGel' | 'estradiolPatch'
//            | 'estradiolPill' | 'progesterone' | 'vaginalDHEA',
//     period: 'monthly' | 'threeMonth' | 'sixMonth' | 'annual',
//     customerEmail: string,
//     customerName?: string,
//     productName?: string,         // human-readable label for metadata
//     billingPeriod?: string,       // human-readable label for metadata
//     priceId?: string,             // optional override — skips server lookup
//     successUrl?: string,
//     cancelUrl?: string,
//     metadata?: object
//   }

const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20'
});

// Map (product, period) → name of the env var that holds the Stripe Price ID
const PRICE_ENV = {
  completeProtocol: {
    monthly:    'NEXT_PUBLIC_STRIPE_PRICE_COMPLETE_MONTHLY',
    threeMonth: 'NEXT_PUBLIC_STRIPE_PRICE_COMPLETE_3MONTH',
    sixMonth:   'NEXT_PUBLIC_STRIPE_PRICE_COMPLETE_6MONTH',
    annual:     'NEXT_PUBLIC_STRIPE_PRICE_COMPLETE_12MONTH'
  },
  estradiolGel: {
    monthly:    'NEXT_PUBLIC_STRIPE_PRICE_GEL_MONTHLY',
    threeMonth: 'NEXT_PUBLIC_STRIPE_PRICE_GEL_3MONTH',
    sixMonth:   'NEXT_PUBLIC_STRIPE_PRICE_GEL_6MONTH',
    annual:     'NEXT_PUBLIC_STRIPE_PRICE_GEL_12MONTH'
  },
  estradiolPatch: {
    monthly:    'NEXT_PUBLIC_STRIPE_PRICE_PATCH_MONTHLY',
    threeMonth: 'NEXT_PUBLIC_STRIPE_PRICE_PATCH_3MONTH',
    sixMonth:   'NEXT_PUBLIC_STRIPE_PRICE_PATCH_6MONTH',
    annual:     'NEXT_PUBLIC_STRIPE_PRICE_PATCH_12MONTH'
  },
  estradiolPill: {
    monthly:    'NEXT_PUBLIC_STRIPE_PRICE_PILL_MONTHLY',
    threeMonth: 'NEXT_PUBLIC_STRIPE_PRICE_PILL_3MONTH',
    sixMonth:   'NEXT_PUBLIC_STRIPE_PRICE_PILL_6MONTH',
    annual:     'NEXT_PUBLIC_STRIPE_PRICE_PILL_12MONTH'
  },
  progesterone: {
    monthly:    'NEXT_PUBLIC_STRIPE_PRICE_PROG_MONTHLY',
    threeMonth: 'NEXT_PUBLIC_STRIPE_PRICE_PROG_3MONTH',
    sixMonth:   'NEXT_PUBLIC_STRIPE_PRICE_PROG_6MONTH',
    annual:     'NEXT_PUBLIC_STRIPE_PRICE_PROG_12MONTH'
  },
  vaginalDHEA: {
    monthly:    'NEXT_PUBLIC_STRIPE_PRICE_DHEA_MONTHLY',
    threeMonth: 'NEXT_PUBLIC_STRIPE_PRICE_DHEA_3MONTH',
    sixMonth:   'NEXT_PUBLIC_STRIPE_PRICE_DHEA_6MONTH',
    annual:     'NEXT_PUBLIC_STRIPE_PRICE_DHEA_12MONTH'
  }
};

function resolvePriceId(product, period) {
  const envName = PRICE_ENV[product] && PRICE_ENV[product][period];
  if (!envName) return null;
  const value = process.env[envName];
  if (!value || !value.startsWith('price_')) return null;
  return value;
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({
      error: 'Server misconfigured: STRIPE_SECRET_KEY is not set.'
    });
  }

  try {
    const {
      product,
      period,
      priceId: priceIdOverride,
      customerEmail,
      customerName,
      productName,
      billingPeriod,
      successUrl,
      cancelUrl,
      metadata
    } = req.body || {};

    // Validate email
    if (!customerEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      return res.status(400).json({ error: 'A valid customerEmail is required.' });
    }

    // Resolve price ID: override wins, else look up via env
    const priceId = priceIdOverride || resolvePriceId(product, period);
    if (!priceId) {
      // Build a clear diagnostic so the operator knows EXACTLY which env var to set
      const expectedEnv = (PRICE_ENV[product] && PRICE_ENV[product][period]) || null;
      let detail = '';
      if (!product || !period) {
        detail = `Request body is missing product or period. Received: { product: ${JSON.stringify(product)}, period: ${JSON.stringify(period)} }.`;
      } else if (!PRICE_ENV[product]) {
        detail = `Unknown product "${product}". Expected one of: ${Object.keys(PRICE_ENV).join(', ')}.`;
      } else if (!PRICE_ENV[product][period]) {
        detail = `Unknown period "${period}" for product "${product}". Expected one of: monthly, threeMonth, sixMonth, annual.`;
      } else if (!process.env[expectedEnv]) {
        detail = `Env var ${expectedEnv} is not set on this deployment. Add it in Vercel → Settings → Environment Variables, then redeploy.`;
      } else if (!process.env[expectedEnv].startsWith('price_')) {
        detail = `Env var ${expectedEnv} is set but its value does not start with "price_" (got: "${String(process.env[expectedEnv]).slice(0, 8)}…"). Fix the value in Vercel.`;
      }
      return res.status(400).json({
        error: `Could not resolve Stripe Price. ${detail}`.trim()
      });
    }

    // Base URL for redirects
    const base = process.env.NEXT_PUBLIC_BASE_URL || `https://${req.headers.host}`;
    const success = successUrl || `${base}/confirmation`;
    const cancel = cancelUrl   || `${base}/results.html`;

    // Pre-create the Customer so we attach friendly metadata for ops/reporting.
    // Stripe Checkout would create one automatically — doing it explicitly gives
    // us metadata + the ability to reuse customer records later.
    const customer = await stripe.customers.create({
      email: customerEmail,
      name: customerName,
      metadata: {
        source: 'her-estrogen-results',
        product: productName || product || '',
        billingPeriod: billingPeriod || period || '',
        ...(metadata || {})
      }
    });

    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: success,
      cancel_url: cancel,
      subscription_data: {
        metadata: {
          source: 'her-estrogen-results',
          product: productName || product || '',
          billingPeriod: billingPeriod || period || '',
          customerEmail
        }
      },
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      customer_update: { address: 'auto', name: 'auto' }
    });

    return res.status(200).json({
      sessionId: session.id,
      url: session.url
    });
  } catch (err) {
    console.error('checkout error:', err);
    const isStripeErr = err && err.type && String(err.type).startsWith('Stripe');
    return res.status(isStripeErr ? 400 : 500).json({
      error: err.message || 'Failed to create checkout session',
      code: err.code,
      type: err.type
    });
  }
};
