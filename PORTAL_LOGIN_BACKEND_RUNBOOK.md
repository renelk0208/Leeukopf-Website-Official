# Portal Login Backend Runbook (Magic Link + Password Reset)

## 1) Critical production settings

### Netlify environment variables (frontend auth)
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_SITE_URL` (set to your live origin, e.g. `https://leeukopf.com`)

If `VITE_SUPABASE_URL` or `VITE_SUPABASE_ANON_KEY` is missing/invalid, magic link and password reset will fail.

### Supabase Auth URL configuration
In **Supabase Dashboard → Authentication → URL Configuration**:

- **Site URL**: `https://leeukopf.com`
- **Additional Redirect URLs** (include all used flows):
  - `https://leeukopf.com/portal`
  - `https://leeukopf.com/portal/login`
  - `https://leeukopf.com/portal/set-password`
  - `https://leeukopf.com/admin/login`
  - `https://www.leeukopf.com/portal`
  - `https://www.leeukopf.com/portal/login`
  - `https://www.leeukopf.com/portal/set-password`
  - `https://www.leeukopf.com/admin/login`

If redirect URLs are not allow-listed, Supabase returns redirect errors and no email is sent.

## 2) Email delivery prerequisites

In **Supabase → Authentication → Email**:
- Confirm email provider is enabled.
- Confirm SMTP provider is configured correctly for production sending.
- Confirm email templates are published (magic link + recovery).

If provider/SMTP is disabled or invalid, users cannot receive magic links or reset emails.

## 3) Client access model (backend)

Portal access depends on:
- Supabase auth identity (`auth.users`) and
- app allowlist (`approved_clients` table)

Existing migration hardening access: `supabase/migrations/20260220090000_harden_client_portal_access.sql`

Operationally, ensure approved clients have matching email entries in `approved_clients`.

## 4) Login detail retention (what to keep)

### Source of truth
- `auth.users` (account existence / timestamps)
- `auth.audit_log_entries` (provider-level auth events, if available on plan)
- Application tables:
  - `approved_clients`
  - `client_registrations`
  - `solid_colour_orders`

### Recommended retention policy
- Authentication/audit logs: **90 days minimum**, 180 days preferred for B2B dispute handling.
- Access allowlist (`approved_clients`): retain until contract end + compliance window.
- Order-linked identity data (`client_registrations`, `solid_colour_orders`): retain per legal/commercial policy.

### Minimum fields to retain for support incidents
- Email (normalized lowercase)
- Event type (magic-link request, recovery request, sign-in success/fail)
- Timestamp (UTC)
- Request origin/domain
- Error message/classification (no secrets/tokens)

## 5) Fast incident checklist (when users cannot login)

1. Confirm Netlify has valid `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_SITE_URL`.
2. Confirm Supabase Site URL + redirect URL allowlist includes `/portal`, `/portal/login`, `/portal/set-password`.
3. Confirm Supabase email provider/SMTP is enabled and healthy.
4. Check user exists in `auth.users` and is approved in `approved_clients`.
5. Review Supabase auth logs and Netlify function/app logs for rate-limit or redirect errors.

## 6) Post-fix validation

- Open `/portal/login`
- Trigger “Email me a secure sign-in link” for a known approved user
- Trigger “Forgot password” and verify redirect lands on `/portal/set-password`
- Complete password update and verify redirect to `/portal`/`/b2b`

## 7) Fail-proof reliability controls

- Keep both redirect paths allow-listed in Supabase: `/portal/set-password` and `/portal/login`.
- Keep `VITE_SITE_URL` aligned with live primary domain and include `www` in redirect allow-list.
- Run a daily synthetic check (manual or scripted): request magic link + request reset for a test account.
- Monitor auth failure classes in logs (`redirect`, `email provider disabled`, `rate limit`, `network`).
- Keep at least one approved internal test account in `approved_clients` for rapid verification during incidents.

