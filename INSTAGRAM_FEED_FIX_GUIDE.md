# Instagram Feed Fix Guide

## Issue Summary

The Instagram feeds for both **@leeukopf_laboratories** and **@gelitup** are currently showing fallback images instead of live Instagram content.

## Root Cause

The Instagram feeds require valid Instagram Graph API access tokens to fetch live content. When these tokens are missing or expired, the application correctly falls back to displaying static placeholder images.

**The code is working as designed.** The issue is that the required environment variables in Netlify are either:
1. Not set (missing)
2. Set but expired (Instagram access tokens expire every 60 days unless refreshed)

## Solution

To fix the Instagram feeds, you need to ensure the following environment variables are correctly set in Netlify:

### Required Environment Variables

#### For Leeukopf Laboratories (@leeukopf_laboratories):
- `IG_LEEUKOPF_ACCESS_TOKEN` - Long-lived Instagram access token
- `IG_LEEUKOPF_USER_ID` - Instagram Business Account ID (value: `17841476480581330`)

#### For GEL.IT.UP (@gelitup):
- `IG_GELITUP_ACCESS_TOKEN` - Long-lived Instagram access token  
- `IG_GELITUP_USER_ID` - Instagram Business Account ID (value: `17841400843573520`)

#### Optional but Recommended (for automatic token refresh):
- `FB_APP_ID` - Facebook App ID
- `FB_APP_SECRET` - Facebook App Secret
- `NETLIFY_ACCESS_TOKEN` - Netlify personal access token
- `NETLIFY_SITE_ID` - Your Netlify site ID

## Step-by-Step Fix Instructions

### Step 1: Check Current Environment Variables

1. Log in to [Netlify Dashboard](https://app.netlify.com)
2. Navigate to your site
3. Go to **Site Settings** → **Environment Variables**
4. Check if the following variables exist:
   - `IG_LEEUKOPF_ACCESS_TOKEN`
   - `IG_LEEUKOPF_USER_ID`
   - `IG_GELITUP_ACCESS_TOKEN`
   - `IG_GELITUP_USER_ID`

### Step 2: Generate New Access Tokens (if needed)

If the tokens are missing or expired, you need to generate new long-lived access tokens. Follow the detailed instructions in the `INSTAGRAM_SETUP.md` file.

**Quick Summary:**
1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Select your Facebook App (or create a new one)
3. Add Instagram Basic Display API
4. Connect to your Instagram Business Accounts
5. Generate long-lived access tokens (valid for 60 days)
6. Save the tokens securely

### Step 3: Set Environment Variables in Netlify

1. In Netlify Dashboard, go to **Site Settings** → **Environment Variables**
2. Click **Add a variable** or **Edit** existing ones
3. Set/update the following:

```
IG_LEEUKOPF_ACCESS_TOKEN = [your_leeukopf_token]
IG_LEEUKOPF_USER_ID = 17841476480581330

IG_GELITUP_ACCESS_TOKEN = [your_gelitup_token]
IG_GELITUP_USER_ID = 17841400843573520
```

4. Make sure to set them for **All deploy contexts** (Production, Deploy Previews, Branch deploys)

### Step 4: Trigger a Redeploy

After setting the environment variables:
1. Go to **Deploys** in your Netlify dashboard
2. Click **Trigger deploy** → **Clear cache and deploy site**
3. Wait for the deployment to complete (usually 2-3 minutes)

### Step 5: Verify the Feeds are Working

After deployment:
1. Visit https://leeukopf.com (should show Leeukopf Instagram feed)
2. Visit https://leeukopf.com/our-brands (should show GEL.IT.UP Instagram feed)

**If feeds are working:**
- You'll see live Instagram posts in a 2x2 grid
- Posts will be clickable and open in a modal
- No fallback message will appear

**If feeds still show fallback images:**
- Check Netlify function logs for errors
- Verify tokens are correctly copied (no extra spaces)
- Verify tokens haven't expired
- See troubleshooting section below

## Automatic Token Refresh (Recommended)

Instagram access tokens expire after 60 days. To avoid this issue recurring, set up automatic token refresh:

1. Set the following additional environment variables in Netlify:
   ```
   FB_APP_ID = [your_facebook_app_id]
   FB_APP_SECRET = [your_facebook_app_secret]
   NETLIFY_ACCESS_TOKEN = [your_netlify_personal_access_token]
   NETLIFY_SITE_ID = [your_netlify_site_id]
   ```

2. The system will automatically refresh tokens before they expire using the Netlify function at `/netlify/functions/refresh-instagram-tokens.ts`

3. You can manually trigger a token refresh by visiting:
   ```
   https://leeukopf.com/.netlify/functions/refresh-instagram-tokens
   ```

See `INSTAGRAM_TOKEN_REFRESH.md` for detailed setup instructions.

## Troubleshooting

### Feed shows "Our live Instagram feed is temporarily unavailable"

**Possible causes:**
1. Access tokens are expired → Generate new tokens
2. Access tokens are missing → Set environment variables
3. Instagram Business Account ID is incorrect → Verify the User ID
4. Facebook App permissions are incorrect → Check app review status

### Only one brand's feed works

If Leeukopf feed works but GEL.IT.UP doesn't (or vice versa):
- The missing brand's environment variables are not set
- Set both `IG_[BRAND]_ACCESS_TOKEN` and `IG_[BRAND]_USER_ID`

### Feed shows old posts

The feed caches results for 5 minutes (300 seconds) by default. To see new posts:
- Wait 5 minutes for cache to expire
- Or lower the cache TTL by setting `IG_CACHE_TTL_SECONDS` environment variable

### How to check if tokens are working

Use the debug mode by visiting:
```
https://leeukopf.com/.netlify/functions/instagram-feed?brand=leeukopf&debug=1
https://leeukopf.com/.netlify/functions/instagram-feed?brand=gelitup&debug=1
```

This will return JSON with detailed error messages.

## Technical Details

### How the Instagram Feed Works

1. **Frontend Component** (`src/components/InstagramFeed.tsx`)
   - Makes a request to `/api/instagram?brand=[leeukopf|gelitup]`
   - Displays live posts if available
   - Shows fallback images if API fails

2. **Backend Function** (`netlify/functions/instagram-feed.ts`)
   - Receives brand parameter from query string
   - Uses brand-specific environment variables
   - Fetches posts from Instagram Graph API
   - Caches results for 5 minutes
   - Returns error if tokens are missing/invalid

3. **API Flow**
   ```
   Browser → Netlify Function → Instagram Graph API
                ↓
           Cache (5 min)
                ↓
           Frontend Component
   ```

### Environment Variable Naming

The system supports both new and legacy environment variable names:

**Leeukopf:**
- New: `IG_LEEUKOPF_ACCESS_TOKEN`, `IG_LEEUKOPF_USER_ID`
- Legacy: `IG_ACCESS_TOKEN`, `IG_USER_ID`, `LEEUKOPF_IG_ACCESS_TOKEN`

**GEL.IT.UP:**
- New: `IG_GELITUP_ACCESS_TOKEN`, `IG_GELITUP_USER_ID`
- Legacy: `GELITUP_IG_USER_ID`, `VITE_GELITUP_IG_ACCESS_TOKEN`

**Recommendation:** Use the new naming convention for clarity.

## Related Documentation

- `INSTAGRAM_SETUP.md` - Detailed setup instructions for Instagram API
- `INSTAGRAM_FEED_STATUS.md` - Implementation status and architecture
- `INSTAGRAM_TOKEN_REFRESH.md` - Automatic token refresh setup
- `INSTAGRAM_TOKEN_AUTO_RENEWAL_FIX.md` - Token renewal troubleshooting
- `.env.example` - Example environment variables

## Summary

The Instagram feed functionality is **fully implemented and working correctly**. The feeds show fallback images because the Instagram API access tokens are either missing or expired in Netlify's environment variables. 

**To fix:**
1. Generate new Instagram access tokens (if needed)
2. Set the environment variables in Netlify
3. Redeploy the site
4. Verify both feeds are displaying live content

**No code changes are required** - this is purely an environment configuration issue.

## Support

If you encounter issues after following this guide:
1. Check Netlify function logs for specific error messages
2. Review `INSTAGRAM_SETUP.md` for detailed token generation steps
3. Use debug mode to see detailed API responses
4. Verify all environment variables are set correctly (no typos or extra spaces)
