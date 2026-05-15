// Supabase clients — used by Vercel Serverless Functions in /api.
// CommonJS so it works on plain Node runtime (no build step).
//
// Required env vars (set in Vercel → Settings → Environment Variables):
//   NEXT_PUBLIC_SUPABASE_URL       — your project URL
//   NEXT_PUBLIC_SUPABASE_ANON_KEY  — public anon key (RLS-restricted)
//   SUPABASE_SERVICE_ROLE_KEY      — SECRET, bypasses RLS, server-only

const { createClient } = require('@supabase/supabase-js');

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!URL) console.warn('[supabase] NEXT_PUBLIC_SUPABASE_URL is not set');
if (!SERVICE) console.warn('[supabase] SUPABASE_SERVICE_ROLE_KEY is not set');

// Public anon client — would be used in client-side code if we needed it.
// Subject to Row Level Security; cannot read patient data.
const supabase = URL && ANON
  ? createClient(URL, ANON, { auth: { persistSession: false } })
  : null;

// Admin client — bypasses RLS. ONLY use inside /api serverless functions.
// Never import this from anything that ships to the browser.
const supabaseAdmin = URL && SERVICE
  ? createClient(URL, SERVICE, { auth: { persistSession: false } })
  : null;

module.exports = { supabase, supabaseAdmin };
