-- Create admin_staff table for managing staff users with granular permissions.
-- The "owner" tier is validated server-side via ADMIN_APPROVER_EMAILS env var.
-- Staff accounts are managed here by the owner and checked via the admin-verify-admin Netlify function.

CREATE TABLE IF NOT EXISTS admin_staff (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  email         TEXT        UNIQUE NOT NULL,
  full_name     TEXT,
  role          TEXT        NOT NULL DEFAULT 'staff' CHECK (role IN ('owner', 'staff')),
  permissions   JSONB       NOT NULL DEFAULT '{
    "view_clients": true,
    "approve_registrations": true,
    "view_orders": true,
    "view_prices": false,
    "manage_products": false,
    "manage_colors": false,
    "manage_brochures": false
  }'::jsonb,
  is_active     BOOLEAN     NOT NULL DEFAULT true,
  created_by    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fast email lookups
CREATE INDEX IF NOT EXISTS admin_staff_email_idx ON admin_staff (email);

-- Enable RLS
ALTER TABLE admin_staff ENABLE ROW LEVEL SECURITY;

-- Authenticated users may only read their own row (used by ProtectedRoute to verify access).
-- All mutations happen server-side via the service role key (Netlify functions).
CREATE POLICY "admin_staff_read_own"
  ON admin_staff
  FOR SELECT
  TO authenticated
  USING (email = auth.email());
