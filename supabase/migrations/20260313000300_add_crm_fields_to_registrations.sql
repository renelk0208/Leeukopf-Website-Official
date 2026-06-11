-- Add CRM tracking fields to client_registrations
-- Allows admins to track pipeline stage, notes, sample sending and contact history

ALTER TABLE client_registrations
  ADD COLUMN IF NOT EXISTS pipeline_stage text DEFAULT 'new',
  ADD COLUMN IF NOT EXISTS samples_sent_at date,
  ADD COLUMN IF NOT EXISTS last_contact_date date,
  ADD COLUMN IF NOT EXISTS admin_notes text;
