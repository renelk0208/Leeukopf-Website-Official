# Instagram Feed Fix - Deployment Guide

## Overview

This guide documents the Instagram feed implementation that fetches Instagram feeds for both Leeukopf and GEL.IT.UP brands. The implementation uses Instagram Business Account IDs directly from environment variables to avoid issues with the `/me/accounts` endpoint.

## Critical Changes Made

### 1. Graph API Flow
The function uses a **direct** approach to fetch Instagram media:

**CURRENT APPROACH:**
```
Step 1: Read IG_LEEUKOPF_USER_ID or IG_GELITUP_USER_ID from environment
Step 2: GET /{ig-business-account-id}/media?fields=...&access_token=...
```

This avoids the problematic `/me/accounts` endpoint which returns error code 200 subcode 2069030 "New Pages experience not supported" for some pages.

### 2. Environment Variables

**Required Variables:**
- `IG_LEEUKOPF_ACCESS_TOKEN` - Long-lived access token for Leeukopf Instagram
- `IG_LEEUKOPF_USER_ID` - Instagram Business Account ID for Leeukopf
- `IG_GELITUP_ACCESS_TOKEN` - Long-lived access token for GEL.IT.UP Instagram
- `IG_GELITUP_USER_ID` - Instagram Business Account ID for GEL.IT.UP

**Legacy Names (Still Supported for Backward Compatibility):**
- Access tokens: `LEEUKOPF_IG_ACCESS_TOKEN`, `IG_ACCESS_TOKEN`
- User IDs: `LEEUKOPF_IG_USER_ID`, `IG_USER_ID`, `GELITUP_IG_USER_ID`

### 3. API Version Update
- Uses `v21.0` as specified in requirements

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

### Step 1: Get Instagram Business Account IDs

For each brand (Leeukopf and GEL.IT.UP), you need to find the **Instagram Business Account ID**:

#### A. Find Your Instagram Business Account ID

1. Go to [Facebook Graph API Explorer](https://developers.facebook.com/tools/explorer/)
2. Select your App from the dropdown
3. Get a User Access Token with these permissions:
   - `instagram_basic`
   - `pages_show_list`
   - `pages_read_engagement`
4. Make this API call:
   ```
   GET /me/accounts?fields=id,name,instagram_business_account
   ```
5. In the response, find your Facebook Page and copy the `instagram_business_account.id` value
6. This is your Instagram Business Account ID (e.g., "17841400008460056")

**Example Response:**
```json
{
  "data": [
    {
      "id": "123456789",
      "name": "Leeukopf Laboratories",
      "instagram_business_account": {
        "id": "17841400008460056"  ← Copy this value
      }
    }
  ]
}
```

**Confirmed Instagram Business Account IDs:**
- **Leeukopf Laboratories**: `17841476480581330`
- **GEL.IT.UP**: `17841400843573520`

**Note:** If you encounter error code 2069030 "New Pages experience not supported" when trying to look up IDs, use the confirmed IDs above. This implementation avoids the `/me/accounts` endpoint entirely to prevent this issue.

#### B. Get Access Tokens

For each brand, you also need a **long-lived access token**:

1. Get a short-lived User Access Token (valid for 1 hour):
   - Use Facebook Login flow or Graph API Explorer
   - Required permissions: `instagram_basic`, `pages_show_list`, `pages_read_engagement`

2. Exchange for long-lived token (valid for 60 days):
   ```bash
   curl -X GET "https://graph.facebook.com/v21.0/oauth/access_token?grant_type=fb_exchange_token&client_id=YOUR_APP_ID&client_secret=YOUR_APP_SECRET&fb_exchange_token=SHORT_LIVED_TOKEN"
   ```

3. The response will contain your long-lived access token

#### C. Test Your Credentials
```bash
# Test Leeukopf
curl "https://graph.facebook.com/v21.0/17841476480581330/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&limit=12&access_token=YOUR_LEEUKOPF_TOKEN"

# Test GEL.IT.UP
curl "https://graph.facebook.com/v21.0/17841400843573520/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&limit=12&access_token=YOUR_GELITUP_TOKEN"
```

Expected response should include your Instagram media posts.

**Why Direct IDs?** This approach uses Instagram Business Account IDs directly from environment variables to avoid the `/me/accounts` endpoint, which can return error code 200 subcode 2069030 "New Pages experience not supported" for some Pages. This is required for New Pages Experience compatibility.

### Step 2: Set Environment Variables in Netlify

1. Go to your Netlify site dashboard
2. Navigate to **Site settings** > **Environment variables**
3. Add/Update the following variables:

   ```
   IG_LEEUKOPF_ACCESS_TOKEN=your_leeukopf_long_lived_token_here
   IG_LEEUKOPF_USER_ID=17841476480581330
   IG_GELITUP_ACCESS_TOKEN=your_gelitup_long_lived_token_here
   IG_GELITUP_USER_ID=17841400843573520
   IG_GRAPH_API_VERSION=v21.0
   IG_CACHE_TTL_SECONDS=300
   ```
   
   **Note:** The Instagram Business Account IDs above are the confirmed values for Leeukopf and GEL.IT.UP brands.

4. **Optional:** If you want automatic token refresh (recommended), also set:
   ```
   FB_APP_ID=your_facebook_app_id
   FB_APP_SECRET=your_facebook_app_secret
   NETLIFY_ACCESS_TOKEN=your_netlify_personal_access_token
   NETLIFY_SITE_ID=your_netlify_site_id
   ```

5. **Note:** Legacy variable names are still supported for backward compatibility, but the new names above are recommended.

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

### Issue: "Failed to retrieve Instagram Business Account ID"

**Cause:** Instagram Business Account ID environment variable not set

**Solution:**
1. Verify you've set `IG_LEEUKOPF_USER_ID` and/or `IG_GELITUP_USER_ID` in Netlify
2. Confirm you're using the Instagram Business Account ID (not Page ID)
3. Get the ID from Graph API Explorer using the method in Step 1A above
4. Check Netlify function logs to verify the environment variable is loaded

### Issue: "Instagram API error (code 190): Invalid OAuth access token"

**Cause:** Token has expired (tokens expire after 60 days)

**Solution:**
1. Generate a new long-lived token (see Step 1B)
2. Update the `IG_LEEUKOPF_ACCESS_TOKEN` or `IG_GELITUP_ACCESS_TOKEN` in Netlify
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
3. Verify both access token AND user ID environment variables are set correctly

### Issue: Error code 2069030 "New Pages experience not supported"

**Cause:** Some Facebook Pages don't support the `/me/accounts` endpoint

**Solution:**
This implementation doesn't use `/me/accounts`, so you should not encounter this error. If you do:
1. Verify you're using the correct Instagram Business Account ID
2. Test the direct media endpoint with curl (see Step 1C)
3. Ensure your Instagram Business Account is properly set up

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

## What Changed?

- **Removed `/me/accounts` endpoint**: No longer used to avoid "New Pages experience not supported" error
- **Direct ID lookup**: Instagram Business Account IDs are now read directly from environment variables
- **New required environment variables**: `IG_LEEUKOPF_USER_ID` and `IG_GELITUP_USER_ID` must be set
- **Backward compatibility maintained**: Legacy environment variable names still work as fallbacks

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
