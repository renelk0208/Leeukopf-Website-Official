/*
  # Create b2b_orders table

  Stores completed B2B checkout submissions so admin can always review orders
  even when email delivery fails.
*/

CREATE TABLE IF NOT EXISTS b2b_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'completed',
  order_date timestamptz,
  company_name text NOT NULL,
  contact_name text,
  contact_email text NOT NULL,
  contact_phone text,
  country text,
  vat_number text,
  shipping_address text,
  line_count integer NOT NULL DEFAULT 0,
  total_qty integer NOT NULL DEFAULT 0,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  source text,
  email_sent boolean NOT NULL DEFAULT false,
  email_error text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE b2b_orders ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'b2b_orders'
      AND policyname = 'Authenticated users can read b2b orders'
  ) THEN
    CREATE POLICY "Authenticated users can read b2b orders"
      ON b2b_orders
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_b2b_orders_created_at
  ON b2b_orders(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_b2b_orders_contact_email
  ON b2b_orders(contact_email);
