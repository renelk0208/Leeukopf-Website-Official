# Automatic Instagram Token Refresh System

## Overview

This system automatically refreshes Instagram long-lived access tokens before they expire, ensuring uninterrupted Instagram feed functionality for both Leeukopf and GEL.IT.UP brands.

## How It Works

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   Netlify Scheduled Function                │
│            (refresh-instagram-tokens.ts)                    │
│                                                             │
│  Runs Daily at 2 AM UTC                                     │
│                                                             │
│  1. Check token expiry (debug_token API)                    │
│  2. Refresh if < 7 days until expiry                        │
│  3. Persist new token to Netlify env vars                   │
│  4. Log all operations                                      │
└─────────────────────────────────────────────────────────────┘
         │                            │
         ▼                            ▼
┌──────────────────┐         ┌──────────────────┐
│  Leeukopf Token  │         │  GEL.IT.UP Token │
│  (IG_ACCESS_TOKEN│         │(IG_GELITUP_ACCESS│
│       )          │         │     _TOKEN)      │
└──────────────────┘         └──────────────────┘
         │                            │
         └─────────┬──────────────────┘
                   ▼
         ┌──────────────────┐
         │  Instagram Feed  │
         │    Function      │
         │ (Always uses     │
         │ refreshed token) │
         └──────────────────┘
```

### Workflow

1. **Daily Check** (2 AM UTC)
   - Scheduled function runs automatically
   - Checks both Leeukopf and GEL.IT.UP tokens independently

2. **Token Status Check**
   - Calls Facebook's `debug_token` endpoint
   - Verifies token is valid
   - Calculates days until expiration

3. **Conditional Refresh**
   - If > 7 days until expiry: Skip refresh (log status)
   - If ≤ 7 days until expiry: Refresh token

4. **Token Refresh**
   - Calls Facebook's `oauth/access_token` endpoint
   - Exchanges current token for new 60-day token
   - Receives new token with fresh expiration

5. **Persistence**
   - Updates Netlify environment variable via Netlify API
   - New token immediately available to feed function
   - No manual intervention required

6. **Logging**
   - All operations logged to Netlify function logs
   - Success/failure status for each brand
   - Days until expiry reported
   - Errors logged but never crash the feed

## Environment Variables Required

### Instagram Tokens (Existing)
- `IG_ACCESS_TOKEN` - Leeukopf long-lived access token
- `IG_GELITUP_ACCESS_TOKEN` - GEL.IT.UP long-lived access token

### Facebook App Credentials (New)
- `FACEBOOK_APP_ID` - Your Facebook App ID
- `FACEBOOK_APP_SECRET` - Your Facebook App Secret

### Netlify API Credentials (New)
- `NETLIFY_API_TOKEN` - Personal access token for Netlify API
- `NETLIFY_SITE_ID` - Your Netlify site ID

## Setup Instructions

### 1. Get Facebook App Credentials

If you already have a Facebook App (used for Instagram API):

1. Go to https://developers.facebook.com/apps/
2. Select your app
3. Go to **Settings > Basic**
4. Copy **App ID** and **App Secret**

If you need to create a new app, see `INSTAGRAM_SETUP.md`.

### 2. Get Netlify API Credentials

**Netlify Personal Access Token:**
1. Log in to Netlify: https://app.netlify.com
2. Click your avatar (top right)
3. Go to **User Settings > Applications**
4. Click **New access token**
5. Name it: "Instagram Token Refresh"
6. Copy the token (save it securely!)

**Netlify Site ID:**
1. Go to your site in Netlify dashboard
2. Navigate to **Site Settings > General**
3. Under **Site details**, find **Site ID**
4. Copy the ID (e.g., `abc12345-1234-5678-abcd-123456789abc`)

### 3. Add Environment Variables to Netlify

1. Go to **Site Settings > Environment variables**
2. Add these variables:

```
FACEBOOK_APP_ID = your_app_id
FACEBOOK_APP_SECRET = your_app_secret
NETLIFY_API_TOKEN = your_personal_access_token
NETLIFY_SITE_ID = your_site_id
```

3. Redeploy the site

### 4. Verify Setup

After deployment:

1. **Trigger Manual Test** (Optional)
   - Go to Netlify dashboard
   - Functions > refresh-instagram-tokens
   - Click "Trigger function"

2. **Check Logs**
   - Look for: "Token Refresh Job Started"
   - Verify both brands are processed
   - Check days until expiry for each token

3. **Monitor Daily Runs**
   - Function runs automatically at 2 AM UTC
   - Check logs daily for first week
   - Ensure no errors

## Configuration

### Refresh Threshold

Default: Refresh when less than **7 days** until expiry

To change, edit `refresh-instagram-tokens.ts`:

```typescript
const DAYS_BEFORE_EXPIRY_TO_REFRESH = 7; // Change this value
```

### Schedule

Default: **Daily at 2 AM UTC**

To change, edit `netlify.toml`:

```toml
[[functions]]
  path = "refresh-instagram-tokens"
  schedule = "0 2 * * *"  # Cron expression
```

Common schedules:
- `0 2 * * *` - Daily at 2 AM UTC
- `0 */6 * * *` - Every 6 hours
- `0 0 * * 0` - Weekly on Sunday at midnight

## Monitoring

### Netlify Function Logs

View logs at: **Netlify Dashboard > Functions > refresh-instagram-tokens**

#### Success Example:
```
=== Instagram Token Refresh Job Started ===
Timestamp: 2024-01-15T02:00:00.000Z

[LEEUKOPF] Checking token expiry...
[LEEUKOPF] Token is valid. Days until expiry: 45

[GEL.IT.UP] Checking token expiry...
[GEL.IT.UP] Token is valid. Days until expiry: 5
[GEL.IT.UP] Token expires in 5 days. Refreshing...
Token refreshed successfully. New token expires in 5184000 seconds (60 days)
Successfully updated IG_GELITUP_ACCESS_TOKEN in Netlify environment variables

=== Token Refresh Job Completed ===
Leeukopf: ✓ Token is still valid for 45 days. No refresh needed.
GEL.IT.UP: ✓ Token successfully refreshed and persisted. Was 5 days from expiry.
```

#### Warning Indicators:
- ⚠️ Token expires in < 7 days (refresh triggered)
- ⚠️ Token refresh attempted but Netlify update failed
- ⚠️ Missing environment variables

#### Error Indicators:
- ❌ Token is invalid
- ❌ Failed to refresh token
- ❌ API request failures

### What Happens on Error

**Key Principle**: Errors never crash the Instagram feed.

If token refresh fails:
1. ✅ Error logged to function logs
2. ✅ Feed continues using existing token
3. ✅ Next refresh attempt tomorrow
4. ✅ Feed shows fallback UI if token expires

## Troubleshooting

### Token Refresh Failed

**Check:**
1. Facebook App credentials correct?
2. Netlify API token valid?
3. Netlify Site ID correct?
4. Function logs show specific error message

**Common Issues:**
- Expired Netlify API token → Generate new one
- Wrong Facebook App credentials → Verify in Meta Developer Console
- Rate limits → Wait and retry
- Network issues → Automatic retry tomorrow

### Token Still Expiring

**If tokens continue to expire despite auto-refresh:**

1. Check scheduled function is running:
   - Netlify Dashboard > Functions
   - Find `refresh-instagram-tokens`
   - Verify last execution time

2. Check function logs for errors

3. Manually trigger function to test

4. Verify environment variables are set correctly

### Manual Token Refresh

If you need to manually refresh a token:

1. Get a new long-lived token (see `INSTAGRAM_SETUP.md`)
2. Update environment variable in Netlify
3. Automatic system will maintain it from there

## Security Considerations

### Token Security
- ✅ Tokens stored in Netlify environment variables (encrypted)
- ✅ Never exposed in logs (tokens redacted)
- ✅ Never committed to repository
- ✅ Only accessible to Netlify functions

### API Token Security
- ✅ Netlify API token limited to environment variable updates
- ✅ Use dedicated token (not user password)
- ✅ Rotate token periodically
- ✅ Revoke if compromised

### App Secret Security
- ✅ Facebook App Secret never exposed client-side
- ✅ Only used server-side in Netlify function
- ✅ Rotate if compromised

## Benefits

### For Users
- ✅ Instagram feed never breaks due to expired tokens
- ✅ Uninterrupted service
- ✅ Professional experience

### For Developers
- ✅ No manual token refresh needed
- ✅ No 2 AM emergencies
- ✅ Clear logs for troubleshooting
- ✅ Automated maintenance

### For Business
- ✅ Reduced operational overhead
- ✅ Improved reliability
- ✅ Professional image maintained
- ✅ Scalable solution for multiple brands

## Migration from Manual Process

### Before (Manual)
1. Token expires every ~60 days
2. Feed breaks
3. Manual token refresh required
4. Update environment variable manually
5. Redeploy site
6. Hope you notice before customers do

### After (Automatic)
1. Scheduled function checks daily
2. Auto-refreshes at 7 days before expiry
3. Persists new token automatically
4. No manual intervention
5. No downtime
6. Peace of mind

## FAQ

**Q: What happens if the scheduled function fails?**
A: It will retry tomorrow. The feed continues using the existing token. If the token expires, the feed shows the fallback UI.

**Q: Can I manually trigger the refresh?**
A: Yes, in Netlify Dashboard > Functions > refresh-instagram-tokens > Trigger function.

**Q: How often does it refresh?**
A: Only when needed (< 7 days until expiry). Typically every ~53 days.

**Q: Does it cost money?**
A: Netlify scheduled functions are included in most plans. Check your plan limits.

**Q: What if I change the Facebook App?**
A: Update `FACEBOOK_APP_ID` and `FACEBOOK_APP_SECRET` in Netlify environment variables.

**Q: Can I add more brands?**
A: Yes, modify `refresh-instagram-tokens.ts` to process additional tokens.

## Support

If you encounter issues:
1. Check Netlify function logs
2. Verify environment variables
3. Test Facebook App credentials
4. Review error messages
5. See `INSTAGRAM_SETUP.md` for additional help

## Summary

✅ **Automatic**: No manual intervention required
✅ **Reliable**: Refreshes before expiration
✅ **Persistent**: Updates stored in Netlify
✅ **Logged**: Full visibility into operations
✅ **Secure**: Tokens properly protected
✅ **Resilient**: Never crashes the feed
✅ **Scalable**: Supports multiple brands

**The era of manual token refresh is over. Sleep well!**
