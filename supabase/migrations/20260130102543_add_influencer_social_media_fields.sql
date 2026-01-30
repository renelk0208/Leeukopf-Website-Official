/*
  # Add Influencer and Social Media Fields to Client Registrations

  1. Changes
    - Add `facebook` column for Facebook handle
    - Add `tiktok` column for TikTok handle
    - Add `interest_influencer` column for Influencer business interest
    - Add `interest_private_label` column for Private Label interest
    - Add `interest_distribution` column for Distribution interest

  2. Notes
    - These fields support the new Influencer option on the client registration form
    - When interest_influencer is true, at least one social media handle should be provided
*/

-- Add new social media fields
ALTER TABLE client_registrations 
  ADD COLUMN IF NOT EXISTS facebook text,
  ADD COLUMN IF NOT EXISTS tiktok text;

-- Add business interest fields
ALTER TABLE client_registrations 
  ADD COLUMN IF NOT EXISTS interest_private_label boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS interest_distribution boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS interest_influencer boolean DEFAULT false;

-- Create index for influencer filtering
CREATE INDEX IF NOT EXISTS idx_client_registrations_interest_influencer 
  ON client_registrations(interest_influencer) WHERE interest_influencer = true;
