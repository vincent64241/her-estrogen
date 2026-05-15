-- =====================================================================
-- HER ESTROGEN — SUPABASE DATABASE SCHEMA
-- Copy + paste this entire file into:
--   Supabase Dashboard → SQL Editor → New query → Run
-- =====================================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------
-- TABLE 1: PATIENTS
-- Created when a patient completes Stripe checkout
-- ------------------------------------------------
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Personal info
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  phone TEXT,

  -- Shipping address
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,

  -- Stripe references
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  stripe_price_id TEXT,

  -- Subscription info
  product_name TEXT,
  billing_period TEXT,
  monthly_amount INTEGER, -- stored in cents (e.g. 14900 = $149.00)

  -- Patient status
  status TEXT DEFAULT 'pending_review'
    CHECK (status IN (
      'pending_review',
      'approved',
      'declined',
      'active',
      'paused',
      'cancelled'
    )),

  -- Subscription dates
  subscription_started_at TIMESTAMPTZ,
  next_billing_date TIMESTAMPTZ,
  subscription_cancelled_at TIMESTAMPTZ,

  -- Record timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------
-- TABLE 2: PRESCRIPTIONS
-- One record per prescription issued to a patient
-- ------------------------------------------------
CREATE TABLE prescriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Link to patient
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,

  -- Medication details
  medication_name TEXT NOT NULL,
  dosage TEXT,
  instructions TEXT,

  -- Provider info
  provider_name TEXT,
  provider_id TEXT,
  reviewed_at TIMESTAMPTZ,
  decline_reason TEXT,

  -- Prescription status
  status TEXT DEFAULT 'awaiting_review'
    CHECK (status IN (
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
    )),

  -- Pharmacy and shipping
  pharmacy_name TEXT,
  pharmacy_order_id TEXT,
  tracking_number TEXT,
  shipping_carrier TEXT,
  estimated_delivery_date DATE,
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,

  -- Refill tracking
  refill_number INTEGER DEFAULT 0,
  next_refill_date DATE,

  -- Record timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------
-- TABLE 3: QUIZ RESPONSES
-- Stores intake quiz answers for provider review
-- ------------------------------------------------
CREATE TABLE quiz_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Link to patient
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,

  -- All quiz answers stored as flexible JSON
  responses JSONB NOT NULL,

  -- Derived summary data
  primary_symptom TEXT,
  hormone_stage TEXT,
  symptom_score INTEGER,
  recommended_product TEXT,

  -- Timestamp
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------
-- TABLE 4: COMMUNICATIONS LOG
-- Every email and SMS ever sent — full audit trail
-- ------------------------------------------------
CREATE TABLE communications_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Link to patient
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,

  -- What was sent
  type TEXT NOT NULL CHECK (type IN ('email', 'sms')),
  event_name TEXT NOT NULL,
  recipient TEXT NOT NULL,
  subject TEXT,
  message_preview TEXT,

  -- Delivery status
  status TEXT DEFAULT 'sent'
    CHECK (status IN ('sent', 'delivered', 'failed', 'bounced')),
  provider_message_id TEXT,
  error_message TEXT,

  -- Timestamp
  sent_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------
-- INDEXES — fast queries on common lookups
-- ------------------------------------------------
CREATE INDEX idx_patients_email                ON patients(email);
CREATE INDEX idx_patients_stripe_customer      ON patients(stripe_customer_id);
CREATE INDEX idx_patients_stripe_subscription  ON patients(stripe_subscription_id);
CREATE INDEX idx_patients_status               ON patients(status);
CREATE INDEX idx_patients_next_billing         ON patients(next_billing_date);
CREATE INDEX idx_prescriptions_patient         ON prescriptions(patient_id);
CREATE INDEX idx_prescriptions_status          ON prescriptions(status);
CREATE INDEX idx_communications_patient        ON communications_log(patient_id);

-- ------------------------------------------------
-- AUTO-UPDATE updated_at on every row change
-- ------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER patients_updated_at
  BEFORE UPDATE ON patients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER prescriptions_updated_at
  BEFORE UPDATE ON prescriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ------------------------------------------------
-- ROW LEVEL SECURITY
-- Locks down all tables — only service role can access
-- ------------------------------------------------
ALTER TABLE patients           ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions      ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_responses     ENABLE ROW LEVEL SECURITY;
ALTER TABLE communications_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_patients"        ON patients           FOR ALL TO service_role USING (true);
CREATE POLICY "service_role_prescriptions"   ON prescriptions      FOR ALL TO service_role USING (true);
CREATE POLICY "service_role_quiz"            ON quiz_responses     FOR ALL TO service_role USING (true);
CREATE POLICY "service_role_communications"  ON communications_log FOR ALL TO service_role USING (true);
