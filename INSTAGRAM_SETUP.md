# Instagram Feed Setup Guide

This guide explains how to configure the Instagram feeds for both Leeukopf Laboratories and GEL.IT.UP brands on the website.

## Overview

The website displays Instagram feeds for two brands:
- **Leeukopf Laboratories** (@leeukopf_laboratories) - on the Home page
- **GEL.IT.UP** (@gelitup) - on the Our Brands page

Both feeds use the Instagram Graph API to fetch and display the latest 4 posts in a 2x2 grid.

## Architecture

### Components
- **Frontend**: `src/components/InstagramFeed.tsx` - React component that displays posts
- **Backend**: `netlify/functions/instagram-feed.ts` - Netlify serverless function that fetches data from Instagram
- **API Endpoint**: `/api/instagram?brand=<leeukopf|gelitup>`

### How It Works
1. The `InstagramFeed` component accepts a `brand` prop (`leeukopf` or `gelitup`)
2. It makes a request to `/api/instagram?brand=<brand>`
3. The Netlify function uses the Instagram Graph API to fetch the latest posts
4. Posts are displayed in a responsive 2x2 grid
5. If the API fails or is not configured, a fallback UI is shown with a link to Instagram

## Required Environment Variables

To enable both Instagram feeds, you need to set the following environment variables in Netlify:

### Leeukopf Laboratories (@leeukopf_laboratories)
```
IG_ACCESS_TOKEN=<your_long_lived_access_token>
IG_USER_ID=<your_instagram_business_account_id>
```

### GEL.IT.UP (@gelitup)
```
IG_GELITUP_ACCESS_TOKEN=<your_long_lived_access_token>
IG_GELITUP_USER_ID=<your_instagram_business_account_id>
```

### Optional Settings
```
IG_GRAPH_API_VERSION=v18.0  # Default: v18.0
IG_CACHE_TTL_SECONDS=300    # Default: 300 (5 minutes)
```

## Getting Instagram API Credentials

To get the required access tokens and user IDs, follow these steps:

### Prerequisites
- Instagram Business or Creator account
- Facebook Page connected to the Instagram account
- Facebook Developer account

### Steps

1. **Create a Facebook App**
   - Go to https://developers.facebook.com/
   - Create a new app or use an existing one
   - Add "Instagram Graph API" product to your app

2. **Get a User Access Token**
   - Go to Facebook Graph API Explorer
   - Select your app
   - Add these permissions: `instagram_basic`, `pages_show_list`, `pages_read_engagement`
   - Generate an access token

3. **Get Your Instagram Business Account ID**
   - Use the Graph API Explorer to make a GET request:
     ```
     GET /me/accounts
     ```
   - Find your Facebook Page ID
   - Then make another request:
     ```
     GET /{page-id}?fields=instagram_business_account
     ```
   - The response will contain your Instagram Business Account ID

4. **Exchange for a Long-Lived Token**
   - User access tokens expire after 1 hour
   - Exchange it for a long-lived token (60 days):
     ```
     GET /oauth/access_token?grant_type=fb_exchange_token
         &client_id={app-id}
         &client_secret={app-secret}
         &fb_exchange_token={short-lived-token}
     ```

5. **Refresh the Long-Lived Token**
   - Long-lived tokens can be refreshed before they expire
   - Set up a process to refresh tokens every 50-55 days
   - See: https://developers.facebook.com/docs/instagram-basic-display-api/guides/long-lived-access-tokens

## Setting Environment Variables in Netlify

1. Log in to your Netlify dashboard
2. Select your site
3. Go to **Site settings** → **Environment variables**
4. Add each variable with its corresponding value
5. Redeploy your site for changes to take effect

## Testing

### Local Development
1. Copy `.env.example` to `.env`
2. Add your Instagram API credentials
3. Run `npm run dev`
4. Navigate to the home page (Leeukopf feed) and Our Brands page (GEL.IT.UP feed)
5. Verify that posts are loading correctly

### Production
1. Deploy to Netlify with environment variables configured
2. Visit your production site
3. Check both feeds:
   - Home page: https://leeukopf.com/ (Leeukopf feed)
   - Our Brands page: https://leeukopf.com/our-brands (GEL.IT.UP feed)
4. If you see the fallback message, check:
   - Environment variables are set correctly in Netlify
   - Access token is still valid (not expired)
   - Instagram account is a Business or Creator account
   - Facebook Page is connected to Instagram account

## Troubleshooting

### Feed shows "Our live Instagram feed is not available right now"
This means:
- Environment variables are missing or incorrect
- Access token has expired
- Instagram API is returning an error
- Instagram account is not a Business/Creator account

**Solutions:**
1. Verify environment variables are set in Netlify
2. Check Netlify function logs for error messages
3. Verify access token is still valid
4. Ensure Instagram account is Business/Creator type
5. Refresh long-lived access token if expired

### Only Leeukopf feed works, GEL.IT.UP shows fallback
This means the GEL.IT.UP environment variables are not set:
- Add `IG_GELITUP_ACCESS_TOKEN` and `IG_GELITUP_USER_ID` to Netlify
- Redeploy the site

### Posts are outdated
The feed is cached for 5 minutes by default:
- Wait 5 minutes and refresh
- Or change `IG_CACHE_TTL_SECONDS` to a lower value

## API Response Format

The `/api/instagram` endpoint returns:

```json
{
  "items": [
    {
      "id": "post_id",
      "type": "IMAGE|VIDEO|REEL|CAROUSEL",
      "imageUrl": "https://...",
      "videoUrl": "https://..." // null for images
      "permalink": "https://www.instagram.com/p/...",
      "caption": "Post caption text",
      "timestamp": "2024-01-01T12:00:00+0000"
    }
  ],
  "error": null // or error message if failed
}
```

## Security Notes

- Access tokens should **never** be committed to the repository
- Use environment variables for all sensitive credentials
- Long-lived tokens should be refreshed regularly
- Consider setting up a scheduled function to refresh tokens automatically
- Monitor Instagram API quota usage to avoid rate limits

## Resources

- [Instagram Graph API Documentation](https://developers.facebook.com/docs/instagram-api)
- [Long-Lived Access Tokens](https://developers.facebook.com/docs/instagram-basic-display-api/guides/long-lived-access-tokens)
- [Instagram Business Account](https://www.facebook.com/business/help/898752960195806)
- [Netlify Environment Variables](https://docs.netlify.com/environment-variables/overview/)
