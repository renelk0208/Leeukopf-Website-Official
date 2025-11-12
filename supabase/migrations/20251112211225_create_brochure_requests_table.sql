/*
  # Create Brochure Requests Table

  1. Purpose
    - Store customer brochure requests for product categories
    - Capture contact information for follow-up and email notifications
    - Enable tracking and management of brochure requests in admin dashboard

  2. New Tables
    - `brochure_requests`
      - `id` (uuid, primary key) - Unique identifier for each request
      - `name` (text, required) - Customer's full name
      - `email` (text, required) - Customer's email address
      - `company` (text, optional) - Customer's company name
      - `country` (text, required) - Customer's country
      - `contact_number` (text, required) - Customer's phone number
      - `category_name` (text, required) - Requested product category name
      - `category_slug` (text, required) - Requested product category slug for reference
      - `created_at` (timestamptz) - Request timestamp

  3. Security
    - Enable RLS on `brochure_requests` table
    - Add policy for public to insert their own requests
    - Add policy for authenticated admins to view all requests

  4. Indexes
    - Index on `category_slug` for filtering by category
    - Index on `created_at` for sorting by date
    - Index on `email` for duplicate checking
*/

-- Create brochure_requests table
CREATE TABLE IF NOT EXISTS brochure_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  company text,
  country text NOT NULL,
  contact_number text NOT NULL,
  category_name text NOT NULL,
  category_slug text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE brochure_requests ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert brochure requests (public form submission)
CREATE POLICY "Anyone can insert brochure requests"
  ON brochure_requests
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Policy: Authenticated users can view all brochure requests (for admin dashboard)
CREATE POLICY "Authenticated users can view all requests"
  ON brochure_requests
  FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_brochure_requests_category_slug 
  ON brochure_requests(category_slug);

CREATE INDEX IF NOT EXISTS idx_brochure_requests_created_at 
  ON brochure_requests(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_brochure_requests_email 
  ON brochure_requests(email);