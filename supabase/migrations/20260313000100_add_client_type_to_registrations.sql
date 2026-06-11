-- Add client_type column to client_registrations
-- Tracks the primary interest tab selected by the registrant: Distributors, PrivateLabel, or Influencers

ALTER TABLE client_registrations
  ADD COLUMN IF NOT EXISTS client_type text;
