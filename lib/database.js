// Database service layer — wraps Supabase calls for Her Estrogen.
// All functions use the service-role admin client (bypasses RLS).
// Throws on hard errors; returns null on "not found" lookups.

const { supabaseAdmin } = require('./supabase');

function requireAdmin() {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client not initialized. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
  }
  return supabaseAdmin;
}

// ─────────────────────────────────────────────────────────
// PATIENT OPERATIONS
// ─────────────────────────────────────────────────────────

async function createPatient(data) {
  const db = requireAdmin();
  // Upsert by email so a Stripe webhook retry doesn't violate the UNIQUE constraint.
  const { data: patient, error } = await db
    .from('patients')
    .upsert(
      { ...data, status: data.status || 'pending_review' },
      { onConflict: 'email', ignoreDuplicates: false }
    )
    .select()
    .single();

  if (error) throw new Error(`createPatient failed: ${error.message}`);
  return patient;
}

async function getPatientByEmail(email) {
  const db = requireAdmin();
  const { data, error } = await db
    .from('patients')
    .select('*, prescriptions(*)')
    .eq('email', email)
    .maybeSingle();
  if (error) return null;
  return data || null;
}

async function getPatientByStripeCustomerId(customerId) {
  const db = requireAdmin();
  const { data, error } = await db
    .from('patients')
    .select('*, prescriptions(*)')
    .eq('stripe_customer_id', customerId)
    .maybeSingle();
  if (error) return null;
  return data || null;
}

async function getPatientBySubscriptionId(subscriptionId) {
  const db = requireAdmin();
  const { data, error } = await db
    .from('patients')
    .select('*, prescriptions(*)')
    .eq('stripe_subscription_id', subscriptionId)
    .maybeSingle();
  if (error) return null;
  return data || null;
}

async function updatePatientStatus(patientId, status, additionalData) {
  const db = requireAdmin();
  const { data, error } = await db
    .from('patients')
    .update({ status, ...(additionalData || {}) })
    .eq('id', patientId)
    .select()
    .single();
  if (error) throw new Error(`updatePatientStatus failed: ${error.message}`);
  return data;
}

async function getAllPatients() {
  const db = requireAdmin();
  const { data, error } = await db
    .from('patients')
    .select('*, prescriptions(*)')
    .order('created_at', { ascending: false });
  if (error) throw new Error(`getAllPatients failed: ${error.message}`);
  return data;
}

// ─────────────────────────────────────────────────────────
// PRESCRIPTION OPERATIONS
// ─────────────────────────────────────────────────────────

async function createPrescription(data) {
  const db = requireAdmin();
  const { data: rx, error } = await db
    .from('prescriptions')
    .insert({ ...data, status: data.status || 'awaiting_review' })
    .select()
    .single();
  if (error) throw new Error(`createPrescription failed: ${error.message}`);
  return rx;
}

async function updatePrescriptionStatus(prescriptionId, status, additionalData) {
  const db = requireAdmin();
  const { data, error } = await db
    .from('prescriptions')
    .update({ status, ...(additionalData || {}) })
    .eq('id', prescriptionId)
    .select()
    .single();
  if (error) throw new Error(`updatePrescriptionStatus failed: ${error.message}`);
  return data;
}

async function getPatientPrescriptions(patientId) {
  const db = requireAdmin();
  const { data, error } = await db
    .from('prescriptions')
    .select('*')
    .eq('patient_id', patientId)
    .order('created_at', { ascending: false });
  if (error) throw new Error(`getPatientPrescriptions failed: ${error.message}`);
  return data;
}

// ─────────────────────────────────────────────────────────
// QUIZ RESPONSES
// ─────────────────────────────────────────────────────────

async function saveQuizResponse(data) {
  const db = requireAdmin();
  const { data: quiz, error } = await db
    .from('quiz_responses')
    .insert(data)
    .select()
    .single();
  if (error) throw new Error(`saveQuizResponse failed: ${error.message}`);
  return quiz;
}

// ─────────────────────────────────────────────────────────
// COMMUNICATIONS LOG
// ─────────────────────────────────────────────────────────

async function logCommunication(data) {
  if (!supabaseAdmin) return; // soft-fail if Supabase not configured
  const { error } = await supabaseAdmin.from('communications_log').insert(data);
  if (error) console.error('logCommunication failed:', error.message);
}

module.exports = {
  createPatient,
  getPatientByEmail,
  getPatientByStripeCustomerId,
  getPatientBySubscriptionId,
  updatePatientStatus,
  getAllPatients,
  createPrescription,
  updatePrescriptionStatus,
  getPatientPrescriptions,
  saveQuizResponse,
  logCommunication
};
