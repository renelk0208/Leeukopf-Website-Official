/*
  # Allow authenticated clients to update and insert their own client registration

  Clients can edit their own profile row (matched by email) from the B2B portal.
  Also adds an explicit authenticated INSERT policy so a client with no existing
  record can create one directly from the portal.
*/

-- Update own registration
DROP POLICY IF EXISTS "Clients can update own registration" ON client_registrations;
CREATE POLICY "Clients can update own registration"
  ON client_registrations
  FOR UPDATE
  TO authenticated
  USING (lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')))
  WITH CHECK (lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')));

-- Insert own registration (authenticated; the anon policy already covers public form)
DROP POLICY IF EXISTS "Clients can insert own registration" ON client_registrations;
CREATE POLICY "Clients can insert own registration"
  ON client_registrations
  FOR INSERT
  TO authenticated
  WITH CHECK (lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')));
