/*
  # Create client registrations table

  1. New Tables
    - `client_registrations`
      - `id` (uuid, primary key)
      - `company` (text, required) - Company or brand name
      - `contact` (text, required) - Contact person name
      - `role` (text) - Job role or title
      - `email` (text, required) - Contact email address
      - `phone` (text) - International phone number
      - `country` (text, required) - Country of operation
      - `website` (text) - Company website
      - `instagram` (text) - Instagram handle
      - `business_type` (text, required) - Type of business
      - `interests` (text[]) - Array of product interests
      - `monthly_volume` (text) - Estimated monthly volume
      - `vat_eori` (text) - VAT/EORI number
      - `billing_address` (text) - Billing address
      - `shipping_address` (text) - Shipping address
      - `language` (text) - Preferred language
      - `notes` (text) - Additional notes
      - `attachments` (jsonb) - Uploaded file information
      - `ip_address` (text) - Submitter IP address
      - `created_at` (timestamptz) - Registration timestamp

  2. Security
    - Enable RLS on `client_registrations` table
    - Add policy for authenticated users (admin) to read all registrations
    - Add policy for anyone to insert (public form submission)
*/

CREATE TABLE IF NOT EXISTS client_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company text NOT NULL,
  contact text NOT NULL,
  role text,
  email text NOT NULL,
  phone text,
  country text NOT NULL,
  website text,
  instagram text,
  business_type text NOT NULL,
  interests text[] DEFAULT '{}',
  monthly_volume text,
  vat_eori text,
  billing_address text,
  shipping_address text,
  language text DEFAULT 'EN',
  notes text,
  attachments jsonb DEFAULT '[]',
  ip_address text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE client_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read all client registrations"
  ON client_registrations
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can submit client registration"
  ON client_registrations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_client_registrations_created_at 
  ON client_registrations(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_client_registrations_email 
  ON client_registrations(email);

CREATE INDEX IF NOT EXISTS idx_client_registrations_country 
  ON client_registrations(country);