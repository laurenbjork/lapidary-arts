-- Add admin_notes to consultations
ALTER TABLE consultations ADD COLUMN IF NOT EXISTS admin_notes TEXT;

-- Add admin_notes to appointments
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS admin_notes TEXT;
