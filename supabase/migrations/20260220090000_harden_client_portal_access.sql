/*
  # Harden client portal access

  1. Create approved_clients allowlist table (invite-only control)
  2. Restrict client_registrations SELECT to own email only
  3. Restrict solid_colour_orders SELECT to own contact_email only
*/

CREATE TABLE IF NOT EXISTS approved_clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  company text,
  notes text,
  invited_at timestamptz,
  approved_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_approved_clients_email
  ON approved_clients (email);

ALTER TABLE approved_clients ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Approved clients can read own row" ON approved_clients;
CREATE POLICY "Approved clients can read own row"
  ON approved_clients
  FOR SELECT
  TO authenticated
  USING (lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')));

DROP POLICY IF EXISTS "Service role can manage approved clients" ON approved_clients;
CREATE POLICY "Service role can manage approved clients"
  ON approved_clients
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can read all client registrations" ON client_registrations;
DROP POLICY IF EXISTS "Clients can read own registration" ON client_registrations;
CREATE POLICY "Clients can read own registration"
  ON client_registrations
  FOR SELECT
  TO authenticated
  USING (lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')));

DROP POLICY IF EXISTS "Authenticated users can read solid colour orders" ON solid_colour_orders;
DROP POLICY IF EXISTS "Clients can read own solid colour orders" ON solid_colour_orders;
CREATE POLICY "Clients can read own solid colour orders"
  ON solid_colour_orders
  FOR SELECT
  TO authenticated
  USING (lower(contact_email) = lower(coalesce(auth.jwt() ->> 'email', '')));
