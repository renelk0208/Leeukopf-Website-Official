-- Add buyer_type column to client_registrations
-- Allowed values: 'finished_goods' | 'bulk' | NULL (not yet assigned)
-- This field is set by Leeukopf Laboratories admin after approving a registration.
-- Clients can read their own buyer_type but cannot update it.

ALTER TABLE client_registrations
  ADD COLUMN IF NOT EXISTS buyer_type text
  CHECK (buyer_type IN ('finished_goods', 'bulk'));
