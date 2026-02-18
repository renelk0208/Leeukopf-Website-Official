/*
  # Create solid colour orders table for CRM/Zoho import

  1. New table: solid_colour_orders
     - Stores client/order details plus line items and a flattened zoho_payload JSON.
     - Linked by order_id (same as emailed/PDF order ID).

  2. Security
     - Enable RLS.
     - Allow authenticated read access for internal admin use.
     - Inserts should come from server-side service role in Netlify function.
*/

CREATE TABLE IF NOT EXISTS solid_colour_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id text NOT NULL UNIQUE,
  order_date date NOT NULL,

  company_name text NOT NULL,
  contact_name text NOT NULL,
  contact_email text NOT NULL,
  contact_number text NOT NULL,
  vat text,
  country text,

  invoice_address text NOT NULL,
  invoice_region text NOT NULL,
  invoice_postal_code text NOT NULL,
  shipping_address text NOT NULL,
  shipping_region text NOT NULL,
  shipping_postal_code text NOT NULL,
  same_address boolean NOT NULL DEFAULT false,

  order_format text NOT NULL DEFAULT 'finished_units',
  qty_unit text NOT NULL DEFAULT 'pcs',
  bulk_container text,

  packaging_mode text NOT NULL,
  packaging_system text NOT NULL,
  packaging_bottle_size text,
  packaging_bottle_color text,
  packaging_brush_shape text,
  packaging_brush_type text,
  packaging_jar_size text,
  packaging_jar_color text,
  packaging_custom_description text,
  packaging_notes text,

  line_count integer NOT NULL DEFAULT 0,
  total_qty numeric(12, 2) NOT NULL DEFAULT 0,
  lines jsonb NOT NULL DEFAULT '[]',
  zoho_payload jsonb NOT NULL DEFAULT '{}',
  source text NOT NULL DEFAULT 'internal_solid_colour_grid',

  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE solid_colour_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read solid colour orders"
  ON solid_colour_orders
  FOR SELECT
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_solid_colour_orders_order_date
  ON solid_colour_orders(order_date DESC);

CREATE INDEX IF NOT EXISTS idx_solid_colour_orders_company
  ON solid_colour_orders(company_name);

CREATE INDEX IF NOT EXISTS idx_solid_colour_orders_contact_email
  ON solid_colour_orders(contact_email);

CREATE INDEX IF NOT EXISTS idx_solid_colour_orders_created_at
  ON solid_colour_orders(created_at DESC);
