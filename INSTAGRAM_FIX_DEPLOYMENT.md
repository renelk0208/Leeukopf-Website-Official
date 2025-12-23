# Instagram Feed Fix - Deployment Guide

## Overview

This fix implements the correct Facebook Graph API flow to fetch Instagram feeds for both Leeukopf and GEL.IT.UP brands. The implementation follows best practices for server-side API calls, proper error handling, and user experience.

## Critical Changes Made

### 1. Correct Graph API Flow
The function now uses the **correct** approach to fetch Instagram media:

**OLD (BROKEN) APPROACH:**
```
/{page-id}/media  ❌  // Causes "nonexisting field (media) on node type (Page)"
```

**NEW (CORRECT) APPROACH:**
```
Step 1: GET /me/accounts?fields=id,name,instagram_business_account
Step 2: Extract instagram_business_account.id (the IG Business Account ID)
Step 3: GET /{ig-business-account-id}/media?fields=...
```

### 2. Environment Variables

**New Variable Names (Primary):**
- `IG_LEEUKOPF_ACCESS_TOKEN` - Long-lived access token for Leeukopf Instagram
- `IG_GELITUP_ACCESS_TOKEN` - Long-lived access token for GEL.IT.UP Instagram

**Legacy Names (Still Supported for Backward Compatibility):**
- `LEEUKOPF_IG_ACCESS_TOKEN`
- `IG_GELITUP_ACCESS_TOKEN`

**Removed Variables (No Longer Needed):**
- ~~`LEEUKOPF_IG_PAGE_ID`~~ - No longer needed, derived from token
- ~~`LEEUKOPF_IG_USER_ID`~~ - No longer needed, derived from token
- ~~`IG_GELITUP_USER_ID`~~ - No longer needed, derived from token

### 3. API Version Update
- Updated from `v20.0` to `v21.0` as specified in requirements

### 4. Response Format
The API now always returns:
```json
{
  "brand": "leeukopf" | "gelitup",
  "items": [...],
  "error": "optional error message"
}
```

### 5. Cache Headers
- Set to `Cache-Control: public, max-age=300` (5 minutes)
- No cache-busting query params needed

### 6. Media Filtering
- Only returns `IMAGE`, `CAROUSEL_ALBUM`, and `VIDEO` types
- For `VIDEO`, uses `thumbnail_url` when available

### 7. Frontend Improvements
- Renders exactly 4 items max per brand
- Shows correct number of placeholders: `(4 - actual_items.length)`
- No error UI banners - errors logged to console only

## Deployment Steps

### Step 1: Get Access Tokens

For each brand (Leeukopf and GEL.IT.UP), you need to generate a **long-lived access token**:

#### A. Initial Setup (if not done already)
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Select your Facebook App
3. Ensure the App has Instagram Basic Display API or Instagram Graph API permissions
4. Connect your Facebook Page to your Instagram Business Account

#### B. Generate Long-Lived Token
1. Get a short-lived User Access Token (valid for 1 hour):
   - Use Facebook Login flow or Graph API Explorer
   - Required permissions: `instagram_basic`, `pages_show_list`, `pages_read_engagement`

2. Exchange for long-lived token (valid for 60 days):
   ```bash
   curl -X GET "https://graph.facebook.com/v21.0/oauth/access_token?grant_type=fb_exchange_token&client_id=YOUR_APP_ID&client_secret=YOUR_APP_SECRET&fb_exchange_token=SHORT_LIVED_TOKEN"
   ```

3. The response will contain your long-lived access token

#### C. Test the Token
```bash
# Test Leeukopf token
curl "https://graph.facebook.com/v21.0/me/accounts?fields=id,name,instagram_business_account&access_token=YOUR_LEEUKOPF_TOKEN"

# Test GEL.IT.UP token
curl "https://graph.facebook.com/v21.0/me/accounts?fields=id,name,instagram_business_account&access_token=YOUR_GELITUP_TOKEN"
```

Expected response should include pages with `instagram_business_account` field.

### Step 2: Set Environment Variables in Netlify

1. Go to your Netlify site dashboard
2. Navigate to **Site settings** > **Environment variables**
3. Add/Update the following variables:

   ```
   IG_LEEUKOPF_ACCESS_TOKEN=your_leeukopf_long_lived_token_here
   IG_GELITUP_ACCESS_TOKEN=your_gelitup_long_lived_token_here
   IG_GRAPH_API_VERSION=v21.0
   IG_CACHE_TTL_SECONDS=300
   ```

4. **Optional:** If you want automatic token refresh (recommended), also set:
   ```
   FB_APP_ID=your_facebook_app_id
   FB_APP_SECRET=your_facebook_app_secret
   NETLIFY_ACCESS_TOKEN=your_netlify_personal_access_token
   NETLIFY_SITE_ID=your_netlify_site_id
   ```

5. **Remove** old variables (if they exist):
   - `LEEUKOPF_IG_PAGE_ID`
   - `LEEUKOPF_IG_USER_ID`
   - `IG_GELITUP_USER_ID`

### Step 3: Deploy

1. Merge this PR to `main` branch
2. Netlify will automatically deploy
3. The Instagram feed function will be available at `/api/instagram?brand={leeukopf|gelitup}`

### Step 4: Verify

After deployment, test the endpoints:

#### Test Leeukopf Feed
```bash
curl "https://leeukopf.com/api/instagram?brand=leeukopf"
```

Expected response:
```json
{
  "brand": "leeukopf",
  "items": [
    {
      "id": "...",
      "type": "IMAGE",
      "imageUrl": "...",
      "videoUrl": null,
      "permalink": "...",
      "caption": "...",
      "timestamp": "..."
    }
  ]
}
```

#### Test GEL.IT.UP Feed
```bash
curl "https://leeukopf.com/api/instagram?brand=gelitup"
```

#### Debug Mode
Add `?debug=1` to see additional debugging information:
```bash
curl "https://leeukopf.com/api/instagram?brand=leeukopf&debug=1"
```

This will include:
- `igIdLast4`: Last 4 digits of Instagram Business Account ID
- `fetchedCount`: Number of items fetched

#### Check Netlify Function Logs
1. Go to Netlify dashboard
2. Navigate to **Functions** tab
3. Click on `instagram-feed`
4. View logs to see:
   - Brand being fetched
   - Whether Instagram Business Account was found
   - Number of items fetched
   - Any error messages

Look for log entries like:
```
IG[leeukopf] Fetching Instagram Business Account from /me/accounts
IG[leeukopf] Found Instagram Business Account: ...1234 (page: Leeukopf Laboratories)
IG[leeukopf] Fetching media from Instagram Business Account: ...1234
IG[leeukopf] Success: instagram_business_account_found=true fetchedCount=12
```

### Step 5: Verify on Website

1. Visit the homepage at `https://leeukopf.com/`
   - Should show Leeukopf Instagram feed (4 items)

2. Visit the brands page at `https://leeukopf.com/our-brands`
   - Should show GEL.IT.UP Instagram feed (4 items)

3. Open browser console:
   - Should see no errors
   - Should see feed loading successfully

4. Test edge cases:
   - Disconnect network and reload - should see placeholder images
   - Check that exactly 4 items are shown (or placeholders if fewer)

## Troubleshooting

### Issue: "Failed to retrieve Instagram Business Account"

**Cause:** Token doesn't have required permissions or Page not connected to Instagram Business Account

**Solution:**
1. Verify the Page is connected to an Instagram Business Account in Facebook Business Manager
2. Ensure the token has `pages_show_list` and `instagram_basic` permissions
3. Test with the curl command from Step 1C above

### Issue: "Instagram API error (code 190): Invalid OAuth access token"

**Cause:** Token has expired (tokens expire after 60 days)

**Solution:**
1. Generate a new long-lived token (see Step 1B)
2. Update the environment variable in Netlify
3. If automatic token refresh is configured, check `refresh-instagram-tokens` function logs

### Issue: No items returned but no error

**Cause:** Instagram account may not have any recent posts or media types filtered out

**Solution:**
1. Check the Instagram account has posts
2. Verify posts are IMAGE, CAROUSEL_ALBUM, or VIDEO types (not REELS or other types)
3. Use debug mode (`?debug=1`) to see `fetchedCount`

### Issue: Placeholders showing instead of posts

**Cause:** Function is returning an error (check console logs)

**Solution:**
1. Check browser console for error messages
2. Check Netlify function logs for detailed error information
3. Verify environment variables are set correctly

## Token Refresh

Long-lived tokens expire after **60 days**. To avoid manual token refresh:

1. Ensure `refresh-instagram-tokens` function is configured (see Step 2.4)
2. This function runs daily and automatically refreshes tokens before they expire
3. Refreshed tokens are automatically updated in Netlify environment variables

To manually trigger a refresh:
```bash
curl "https://leeukopf.com/.netlify/functions/refresh-instagram-tokens"
```

## Security Notes

1. **Never commit tokens to the repository** - tokens are stored only in Netlify environment variables
2. **Tokens are never logged** - the function logs only the last 4 digits for debugging
3. **CORS is restricted** - API only accepts requests from leeukopf.com and localhost (dev)
4. **Server-side only** - Instagram API is never called from client-side code

## What Happened to Old Code?

- **Page ID lookups removed**: No longer needed, we derive the Instagram Business Account ID directly from the token
- **User ID configuration removed**: No longer needed, same reason
- **Old API flow removed**: The broken `/{page-id}/media` approach has been completely removed
- **Backward compatibility maintained**: Old environment variable names still work as fallbacks

## Support

If you encounter issues:

1. Check Netlify function logs first
2. Use debug mode (`?debug=1`) to get more information
3. Verify tokens using the curl commands in Step 1C
4. Check that all environment variables are set correctly

## References

- [Facebook Graph API Documentation](https://developers.facebook.com/docs/graph-api)
- [Instagram Graph API](https://developers.facebook.com/docs/instagram-api)
- [Long-Lived Access Tokens](https://developers.facebook.com/docs/instagram-basic-display-api/guides/long-lived-access-tokens)
