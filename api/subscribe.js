// Serverless endpoint: verifies the Cloudflare Turnstile token before accepting a lead.
//
// SECURITY: the Turnstile *secret* key lives ONLY in the Vercel environment
// variable TURNSTILE_SECRET_KEY. It is never hard-coded here and never sent to
// the browser. Set it in Vercel: Project > Settings > Environment Variables.
//
// The public *site* key is safe in the page (index.html data-sitekey) — do not
// confuse the two.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  const body = req.body || {};
  const token = body.token;
  const email = (body.email || '').trim();

  if (!token) {
    return res.status(400).json({ ok: false, error: 'missing_token' });
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return res.status(400).json({ ok: false, error: 'invalid_email' });
  }

  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    // Fail closed if the env var is not configured — never accept unverified.
    return res.status(500).json({ ok: false, error: 'not_configured' });
  }

  // Verify the token with Cloudflare.
  const form = new URLSearchParams();
  form.append('secret', secret);
  form.append('response', token);
  const ip = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || '';
  if (ip) form.append('remoteip', String(ip).split(',')[0].trim());

  let verify;
  try {
    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: form,
    });
    verify = await r.json();
  } catch (_) {
    return res.status(502).json({ ok: false, error: 'verify_unreachable' });
  }

  if (!verify || !verify.success) {
    return res.status(403).json({ ok: false, error: 'verification_failed' });
  }

  // Human confirmed. Forward the lead to GoHighLevel via an Inbound Webhook.
  // GHL_WEBHOOK_URL is the workflow's Inbound Webhook URL, stored as a Vercel
  // env var (treat it as a secret — anyone with the URL can post to your CRM).
  const hook = process.env.GHL_WEBHOOK_URL;
  if (!hook) {
    return res.status(500).json({ ok: false, error: 'lead_sink_not_configured' });
  }

  try {
    const r = await fetch(hook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, source: 'guide-form', tag: 'guide-lead' }),
    });
    if (!r.ok) {
      return res.status(502).json({ ok: false, error: 'lead_forward_failed' });
    }
  } catch (_) {
    return res.status(502).json({ ok: false, error: 'lead_forward_unreachable' });
  }

  return res.status(200).json({ ok: true });
}
