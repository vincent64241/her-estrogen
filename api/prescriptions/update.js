// Vercel Serverless Function — POST /api/prescriptions/update
// Updates a prescription's status + ancillary fields. Called by:
//   - Provider portal (when a clinician approves / declines)
//   - Pharmacy partner webhook (when meds ship / deliver)
//
// Required env vars:
//   NEXT_PUBLIC_SUPABASE_URL
//   SUPABASE_SERVICE_ROLE_KEY
//   PRESCRIPTION_UPDATE_TOKEN   (optional shared secret — see "Authentication" below)
//
// Request body:
//   {
//     prescription_id: UUID,          // required
//     status: 'approved' | 'declined' | 'sent_to_pharmacy' | 'shipped' | 'delivered' | etc.,
//     tracking_number?: string,
//     shipping_carrier?: string,
//     estimated_delivery_date?: 'YYYY-MM-DD',
//     provider_name?: string,
//     decline_reason?: string
//   }
//
// Authentication: if PRESCRIPTION_UPDATE_TOKEN env var is set, requests must
// include `Authorization: Bearer <token>`. Recommended for production.

const { updatePrescriptionStatus } = require('../../lib/database');

const ALLOWED_STATUS = new Set([
  'awaiting_review',
  'under_review',
  'approved',
  'declined',
  'sent_to_pharmacy',
  'being_prepared',
  'shipped',
  'delivered',
  'refill_scheduled',
  'cancelled'
]);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Optional bearer-token auth — strongly recommended in production
  const expectedToken = process.env.PRESCRIPTION_UPDATE_TOKEN;
  if (expectedToken) {
    const auth = req.headers['authorization'] || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (token !== expectedToken) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }

  try {
    const {
      prescription_id,
      status,
      tracking_number,
      shipping_carrier,
      estimated_delivery_date,
      provider_name,
      provider_id,
      decline_reason,
      pharmacy_name,
      pharmacy_order_id,
      dosage,
      instructions
    } = req.body || {};

    if (!prescription_id || !status) {
      return res.status(400).json({
        error: 'prescription_id and status are required.'
      });
    }
    if (!ALLOWED_STATUS.has(status)) {
      return res.status(400).json({
        error: `Invalid status "${status}". Allowed: ${Array.from(ALLOWED_STATUS).join(', ')}`
      });
    }

    // Build the additional fields object — only include keys that came in,
    // and auto-set the relevant timestamp for the new status.
    const now = new Date().toISOString();
    const extra = {
      ...(tracking_number && { tracking_number }),
      ...(shipping_carrier && { shipping_carrier }),
      ...(estimated_delivery_date && { estimated_delivery_date }),
      ...(provider_name && { provider_name }),
      ...(provider_id && { provider_id }),
      ...(decline_reason && { decline_reason }),
      ...(pharmacy_name && { pharmacy_name }),
      ...(pharmacy_order_id && { pharmacy_order_id }),
      ...(dosage && { dosage }),
      ...(instructions && { instructions }),
      ...(status === 'approved'  && { reviewed_at: now }),
      ...(status === 'declined'  && { reviewed_at: now }),
      ...(status === 'shipped'   && { shipped_at: now }),
      ...(status === 'delivered' && { delivered_at: now })
    };

    const updated = await updatePrescriptionStatus(prescription_id, status, extra);

    return res.status(200).json({ success: true, prescription: updated });
  } catch (err) {
    console.error('prescriptions/update error:', err);
    return res.status(500).json({ error: err.message || 'Unknown server error' });
  }
};
