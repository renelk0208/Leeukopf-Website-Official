# Instagram Feed Fix - Deployment Guide

## Overview
This PR fixes the Instagram feed rendering issue where the error "Tried accessing nonexisting field (media) on node type (Page)" was occurring for the GEL.IT.UP brand.

## What Was Fixed

### Root Cause
The environment variables `IG_USER_ID` and `IG_GELITUP_USER_ID` were storing **Facebook Page IDs** instead of **Instagram Business Account IDs**. The Facebook Graph API does not allow accessing the `media` field on Page nodes - only on Instagram Business Account nodes.

### Solution
Implemented the correct two-step Graph API flow:
1. **First call**: `GET /{PAGE_ID}?fields=instagram_business_account&access_token=...`
   - Gets the Instagram Business Account ID from the Facebook Page ID
2. **Second call**: `GET /{IG_ID}?fields=media.limit(4){id,caption,media_type,media_url,permalink,thumbnail_url,timestamp}&access_token=...`
   - Fetches the actual Instagram posts from the Instagram Business Account

## Required Actions for Deployment

### 1. Update Environment Variables in Netlify

You need to update your Netlify environment variables to use the new naming convention:

**For Leeukopf Laboratories:**
- Keep: `IG_ACCESS_TOKEN` (no change needed)
- Rename/Update: `IG_USER_ID` → `IG_PAGE_ID` (must be your Facebook Page ID)

**For GEL.IT.UP:**
- Keep: `IG_GELITUP_ACCESS_TOKEN` (no change needed)
- Rename/Update: `IG_GELITUP_USER_ID` → `IG_GELITUP_PAGE_ID` (must be your Facebook Page ID)

**Important Notes:**
- The old variable names (`IG_USER_ID`, `IG_GELITUP_USER_ID`) will still work for backward compatibility
- However, deprecation warnings will be logged in Netlify function logs
- The value must be your **Facebook Page ID**, NOT the Instagram Business Account ID
- The function will automatically resolve the Instagram Business Account ID

### 2. How to Find Your Facebook Page ID

1. Log in to Facebook Graph API Explorer: https://developers.facebook.com/tools/explorer/
2. Select your app
3. Make a GET request to: `/me/accounts`
4. Find your Facebook Page in the response
5. Copy the `id` field (this is your Page ID)
6. Verify it's connected to Instagram:
   ```
   GET /{page-id}?fields=instagram_business_account
   ```
   You should see an `instagram_business_account` object in the response

### 3. Update Variables in Netlify

1. Log in to Netlify dashboard
2. Go to: Site Settings → Environment Variables
3. Add or update these variables:
   - `IG_PAGE_ID` = your Facebook Page ID
   - `IG_GELITUP_PAGE_ID` = your GEL.IT.UP Facebook Page ID
4. (Optional) Remove the old variables once confirmed working:
   - `IG_USER_ID`
   - `IG_GELITUP_USER_ID`

### 4. Deploy

After updating the environment variables:
1. Merge this PR to the `main` branch
2. Netlify will automatically deploy
3. Monitor the deployment logs for any errors

## What to Expect After Deployment

### Success Case
- Instagram feed will load successfully
- You'll see 4 recent posts in a 2x2 grid
- Logs will show: `"Successfully retrieved Instagram Business Account ID: {id} from Page ID: {page_id}"`
- The error "Tried accessing nonexisting field (media) on node type (Page)" will be gone

### If Feed Still Shows Fallback
The feed will now show a beautiful fallback UI with:
- 4 product images in a 2x2 grid (instead of empty space)
- Clear message: "Our live Instagram feed is temporarily unavailable"
- Call-to-action button linking to Instagram profile
- Hoverable product images that link to Instagram

Possible reasons for fallback:
1. Environment variables not yet updated in Netlify
2. Access token expired (refresh the long-lived token)
3. Facebook Page not connected to Instagram Business Account

Check Netlify function logs for specific error messages.

## Monitoring

### Netlify Function Logs
To verify the fix is working:
1. Go to: Netlify Dashboard → Functions → instagram-feed
2. Look for these log messages:
   - ✅ Success: `"Successfully retrieved Instagram Business Account ID: {id} from Page ID: {page_id}"`
   - ✅ Success: `"Successfully fetched X Instagram posts"`
   - ⚠️ Warning: `"DEPRECATION WARNING: IG_USER_ID is deprecated. Please use IG_PAGE_ID instead."`
   - ❌ Error: Check specific error message for troubleshooting

### Frontend Behavior
- **Loading state**: Shows skeleton loaders (animated gray boxes)
- **Success state**: Shows 4 Instagram posts in grid
- **Error/Empty state**: Shows fallback UI with product images and CTA

## Technical Details

### Changed Files
- `netlify/functions/instagram-feed.ts` - Fixed Graph API flow
- `src/components/InstagramFeed.tsx` - Enhanced fallback UI
- `.env.example` - Updated variable names with documentation
- `INSTAGRAM_SETUP.md` - Comprehensive setup guide
- `public/img/instagram-fallback/` - Added 4 fallback images
- `.gitignore` - Ignore generated sitemap.xml

### New Features
- **Two-step API flow**: Automatically resolves IG Business Account ID from Page ID
- **Enhanced error handling**: All errors return HTTP 200 with graceful degradation
- **Fallback UI**: Beautiful product image grid when feed unavailable
- **Backward compatibility**: Supports old variable names with deprecation warnings
- **Performance optimization**: Reduced API fetch limit from 12 to 4 posts
- **Better logging**: Detailed server-side logs for troubleshooting

### Security
- ✅ No security vulnerabilities found (CodeQL scan passed)
- ✅ All errors handled gracefully without exposing sensitive data
- ✅ Access tokens remain server-side only
- ✅ CORS properly configured

## Rollback Plan

If issues occur after deployment:
1. Revert environment variables to old names (`IG_USER_ID`, `IG_GELITUP_USER_ID`)
2. The code will still work with old variable names
3. Or revert the PR and redeploy previous version

## Support

If you encounter issues:
1. Check Netlify function logs for specific error messages
2. Verify Facebook Page is connected to Instagram Business Account
3. Verify access token is still valid
4. See `INSTAGRAM_SETUP.md` for detailed troubleshooting

## Summary

✅ **Problem**: Error "Tried accessing nonexisting field (media) on node type (Page)"
✅ **Root Cause**: Using Page ID as if it were an IG Business Account ID
✅ **Solution**: Two-step API flow to resolve IG Business Account ID from Page ID
✅ **Improvement**: Beautiful fallback UI with product images
✅ **Action Required**: Update Netlify environment variables to use Facebook Page IDs
✅ **Status**: Ready for deployment after environment variable update
