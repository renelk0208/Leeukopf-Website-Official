-- Add client-type specific fields to client_registrations
-- Distributors fields
ALTER TABLE client_registrations
  ADD COLUMN IF NOT EXISTS countries_covered text,
  ADD COLUMN IF NOT EXISTS distribution_channels text,
  ADD COLUMN IF NOT EXISTS estimated_monthly_volume text,
  ADD COLUMN IF NOT EXISTS years_in_business text;

-- Private Label fields
ALTER TABLE client_registrations
  ADD COLUMN IF NOT EXISTS brand_name text,
  ADD COLUMN IF NOT EXISTS product_interest text,
  ADD COLUMN IF NOT EXISTS target_moq text,
  ADD COLUMN IF NOT EXISTS target_launch_date text;

-- Influencer fields
ALTER TABLE client_registrations
  ADD COLUMN IF NOT EXISTS country_audience text,
  ADD COLUMN IF NOT EXISTS avg_views text;
