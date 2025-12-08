# Netlify Serverless Form Submission Endpoints Fix

## Issue Description

The Netlify serverless form submission endpoints were experiencing routing issues:
- `/api/contact-email`
- `/api/client-registration-email`
- `/api/test-email`

These endpoints are handled by Netlify Functions that should be triggered when these routes are accessed.

## Investigation Results

### 1. ✅ No `_redirects` File Conflict

**Checked:**
- `public/_redirects` - Does not exist ✅
- Any `_redirects` file in the repository - None found ✅
- Build process - Does not create `_redirects` files ✅
- `dist/_redirects` after build - Does not exist ✅

**Conclusion:** No `_redirects` file was overriding the `netlify.toml` configuration.

### 2. ✅ SPA Fallback Correctly Configured

The SPA fallback rule exists in `netlify.toml`:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

This is correctly positioned to catch all non-function routes.

### 3. ✅ All Functions Have Path Configuration

All Netlify Functions properly define their paths:

**send-contact-email.ts:**
```typescript
export const config = {
  path: '/api/contact-email'
};
```

**send-client-registration-email.ts:**
```typescript
export const config = {
  path: '/api/client-registration-email'
};
```

**test-email.ts:**
```typescript
export const config = {
  path: '/api/test-email'
};
```

**instagram-feed.ts:**
```typescript
export const config = {
  path: '/api/instagram'
};
```

### 4. ⚠️ Issue Identified: Redundant Redirects

The `netlify.toml` file contained **redundant redirect rules** that were conflicting with the function path configurations:

```toml
[[redirects]]
  from = "/api/contact-email"
  to = "/.netlify/functions/send-contact-email"
  status = 200

[[redirects]]
  from = "/api/client-registration-email"
  to = "/.netlify/functions/send-client-registration-email"
  status = 200

[[redirects]]
  from = "/api/test-email"
  to = "/.netlify/functions/test-email"
  status = 200
```

**Problem:** When Netlify Functions use `export const config = { path: '...' }`, they automatically register their routes. Having explicit redirects in `netlify.toml` can cause conflicts where the redirect is processed before the function, potentially routing requests to index.html instead.

## Solution Implemented

### Changes Made

**Removed redundant redirects from `netlify.toml`:**

```diff
- # Explicit redirects for API endpoints to Netlify Functions
- # These MUST come before the SPA wildcard redirect
- [[redirects]]
-   from = "/api/contact-email"
-   to = "/.netlify/functions/send-contact-email"
-   status = 200
- 
- [[redirects]]
-   from = "/api/client-registration-email"
-   to = "/.netlify/functions/send-client-registration-email"
-   status = 200
- 
- [[redirects]]
-   from = "/api/instagram"
-   to = "/.netlify/functions/instagram-feed"
-   status = 200
- 
- [[redirects]]
-   from = "/api/test-email"
-   to = "/.netlify/functions/test-email"
-   status = 200

  # SPA redirect - serve index.html for all other routes
+ # Netlify Functions with path configuration take precedence automatically
  [[redirects]]
    from = "/*"
    to = "/index.html"
    status = 200
```

### Final Configuration

**netlify.toml:**
```toml
[build]
  base = ""
  command = "npm run build"
  publish = "dist"

[functions]
  directory = "netlify/functions"

[build.environment]
  NODE_VERSION = "18"

# SPA redirect - serve index.html for all other routes
# Netlify Functions with path configuration take precedence automatically
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## How It Works Now

1. **Netlify Functions Register Their Paths:** Each function with `export const config = { path: '/api/...' }` automatically registers its route with Netlify.

2. **Functions Take Precedence:** When a request comes to `/api/contact-email`, Netlify matches it to the function first, before checking redirect rules.

3. **SPA Fallback:** Only requests that don't match any function paths fall through to the `/* → /index.html` redirect, ensuring the React app handles client-side routing.

## Verification

All checks pass:
- ✅ Build completes successfully
- ✅ No `_redirects` file in dist/ after build
- ✅ All 4 Netlify Functions have proper path configuration
- ✅ Linter passes
- ✅ TypeScript typecheck passes
- ✅ Code review passes with no comments
- ✅ CodeQL security check passes

## Best Practices

### ✅ DO:
- Use `export const config = { path: '/api/...' }` in Netlify Functions
- Keep only the SPA fallback redirect (`/*`) in netlify.toml
- Let function path configurations handle API routing automatically

### ❌ DON'T:
- Add explicit `[[redirects]]` rules for function paths in netlify.toml
- Create a `_redirects` file in the `public/` directory (it overrides netlify.toml)
- Mix redirect configurations (use either path config OR redirects, not both)

## Testing After Deployment

Once deployed to Netlify, test each endpoint:

```bash
# Test email function
curl https://leeukopf.com/api/test-email

# Should return JSON like:
# {"message":"Test endpoint is working!","timestamp":"..."}

# Test contact form submission
curl -X POST https://leeukopf.com/api/contact-email \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","message":"Test"}'

# Test client registration
curl -X POST https://leeukopf.com/api/client-registration-email \
  -H "Content-Type: application/json" \
  -d '{"company":"Test Co","email":"test@example.com",...}'
```

All endpoints should return JSON responses, **not** the index.html file.

## References

- [Netlify Functions Documentation](https://docs.netlify.com/functions/overview/)
- [Netlify Redirects Priority](https://docs.netlify.com/routing/redirects/#rule-processing-order)
- Repository Memory: "All Netlify Functions must use path configuration and should never use explicit redirects in netlify.toml"
