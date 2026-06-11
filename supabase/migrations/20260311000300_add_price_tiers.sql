-- Add price_tier column to client_registrations
-- Allowed values: 'standard' | 'distributor' | 'key_account' | NULL (not yet priced)
-- NULL means the client is a new/unpriced client — they get a quote request flow.
-- Set by Leeukopf Laboratories admin after agreeing pricing.

ALTER TABLE client_registrations
  ADD COLUMN IF NOT EXISTS price_tier text
  CHECK (price_tier IN ('standard', 'distributor', 'key_account'));

-- ─────────────────────────────────────────────────────────────────
-- Price tiers table
-- Prices are per subcategory (all shades in a subcategory share a price).
-- Unit is the selling unit — 'pcs' for finished goods, 'kg' for bulk.
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS b2b_price_tiers (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tier        text NOT NULL CHECK (tier IN ('standard', 'distributor', 'key_account')),
  subcategory text NOT NULL,
  unit        text NOT NULL DEFAULT 'pcs' CHECK (unit IN ('pcs', 'kg')),
  price       numeric(10, 4) NOT NULL CHECK (price >= 0),
  currency    text NOT NULL DEFAULT 'EUR',
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now(),
  UNIQUE (tier, subcategory, unit)
);

ALTER TABLE b2b_price_tiers ENABLE ROW LEVEL SECURITY;

-- Admins can manage all price tiers
CREATE POLICY "Admins can manage price tiers"
  ON b2b_price_tiers
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
        AND auth.users.email = ANY(
          string_to_array(current_setting('app.admin_emails', true), ',')
        )
    )
  );

-- Authenticated clients can read price tiers (RLS: they only see prices via the portal)
CREATE POLICY "Authenticated users can read price tiers"
  ON b2b_price_tiers
  FOR SELECT
  TO authenticated
  USING (true);

-- ─────────────────────────────────────────────────────────────────
-- Seed with representative starting prices (edit in Supabase dashboard)
-- These are examples only — update to your actual agreed prices.
-- ─────────────────────────────────────────────────────────────────
INSERT INTO b2b_price_tiers (tier, subcategory, unit, price, currency) VALUES
  ('standard',    'Solid Colours',        'pcs', 2.50, 'EUR'),
  ('standard',    'Cat Eye',              'pcs', 2.50, 'EUR'),
  ('standard',    'Platinum',             'pcs', 2.50, 'EUR'),
  ('standard',    'French Collection',    'pcs', 2.50, 'EUR'),
  ('standard',    'Glitters',             'pcs', 2.50, 'EUR'),
  ('standard',    'Cream Collection',     'pcs', 2.50, 'EUR'),
  ('standard',    'Rubber Bases',         'pcs', 3.00, 'EUR'),
  ('standard',    'Classic Base',         'pcs', 3.00, 'EUR'),
  ('standard',    'Extra Strength Base',  'pcs', 3.00, 'EUR'),
  ('standard',    'Top Coat',             'pcs', 3.00, 'EUR'),
  ('standard',    'Builder Gel',          'pcs', 8.00, 'EUR'),
  ('standard',    'BIAB',                 'pcs', 8.00, 'EUR'),
  ('standard',    'Polygel',              'pcs', 6.00, 'EUR'),
  ('standard',    'Liquid Polygel',       'pcs', 6.00, 'EUR'),
  -- bulk: priced per kg
  ('standard',    'Solid Colours',        'kg',  45.00, 'EUR'),
  ('standard',    'Cat Eye',              'kg',  45.00, 'EUR'),
  ('standard',    'Platinum',             'kg',  45.00, 'EUR'),
  ('standard',    'French Collection',    'kg',  45.00, 'EUR'),
  ('standard',    'Glitters',             'kg',  45.00, 'EUR'),
  ('standard',    'Rubber Bases',         'kg',  50.00, 'EUR'),
  ('standard',    'Classic Base',         'kg',  50.00, 'EUR'),
  ('standard',    'Extra Strength Base',  'kg',  50.00, 'EUR'),
  ('standard',    'Top Coat',             'kg',  50.00, 'EUR'),
  ('standard',    'Builder Gel',          'kg',  60.00, 'EUR'),
  ('standard',    'Liquid Polygel',       'kg',  55.00, 'EUR'),
  ('distributor', 'Solid Colours',        'pcs', 1.90, 'EUR'),
  ('distributor', 'Cat Eye',              'pcs', 1.90, 'EUR'),
  ('distributor', 'Platinum',             'pcs', 1.90, 'EUR'),
  ('distributor', 'French Collection',    'pcs', 1.90, 'EUR'),
  ('distributor', 'Glitters',             'pcs', 1.90, 'EUR'),
  ('distributor', 'Cream Collection',     'pcs', 1.90, 'EUR'),
  ('distributor', 'Rubber Bases',         'pcs', 2.30, 'EUR'),
  ('distributor', 'Classic Base',         'pcs', 2.30, 'EUR'),
  ('distributor', 'Extra Strength Base',  'pcs', 2.30, 'EUR'),
  ('distributor', 'Top Coat',             'pcs', 2.30, 'EUR'),
  ('distributor', 'Builder Gel',          'pcs', 6.50, 'EUR'),
  ('distributor', 'BIAB',                 'pcs', 6.50, 'EUR'),
  ('distributor', 'Polygel',              'pcs', 5.00, 'EUR'),
  ('distributor', 'Liquid Polygel',       'pcs', 5.00, 'EUR')
ON CONFLICT (tier, subcategory, unit) DO NOTHING;
