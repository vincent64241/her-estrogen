// Vercel Serverless Function — GET /api/test-supabase
// TEMPORARY diagnostic endpoint. Creates a fake patient + prescription via the
// Supabase service-role client to verify the database wiring works end-to-end.
//
// To use: visit https://<your-vercel-url>/api/test-supabase in a browser.
//   - 200 + JSON body with the inserted rows → wiring is correct
//   - 500 + error message → check env vars, schema, or RLS policies
//
// ⚠ DELETE THIS FILE before production launch. The endpoint is unauthenticated
//   and will let anyone create rows in your patients/prescriptions tables.

const { createPatient, createPrescription } = require('../lib/database');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Create a test patient
    const patient = await createPatient({
      email: `test-${Date.now()}@herestrogen.com`,
      full_name: 'Test Patient',
      phone: '+18047150329',
      stripe_customer_id: `cus_test_${Date.now()}`,
      product_name: 'Her Estrogen — Complete Protocol Bundle',
      billing_period: 'monthly',
      monthly_amount: 21900
    });

    // Create a test prescription tied to that patient
    const prescription = await createPrescription({
      patient_id: patient.id,
      medication_name: 'Complete Protocol Bundle',
      instructions: 'Apply as directed by provider'
    });

    return res.status(200).json({
      success: true,
      patient,
      prescription
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message || 'Unknown error'
    });
  }
};
