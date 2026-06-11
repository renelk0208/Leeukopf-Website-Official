# Meta Pixel Quick Start Guide

## ✅ Implementation Complete

All requirements have been implemented. The Meta Pixel is now:
- **Consent-gated**: Only loads after marketing cookies are accepted
- **Domain-validated**: Only fires on leeukopf.com
- **Lead-enabled**: Tracks form submissions
- **Development-friendly**: Logs in dev mode, silent in production
- **CAPI-ready**: Prepared for future server-side tracking

## 🚀 Deployment Steps

### 1. Set Environment Variable

In Netlify Dashboard:
1. Go to **Site Settings** → **Environment Variables**
2. Add new variable:
   - **Key**: `VITE_META_PIXEL_ID`
   - **Value**: Your Meta Pixel ID (e.g., `123456789012345`)
3. Click **Save**

### 2. Deploy

- Merge this PR to `main` branch
- Netlify will automatically build and deploy
- Or trigger manual deployment in Netlify Dashboard

### 3. Verify Deployment

After deployment:

**A. Test Cookie Consent**
1. Visit https://leeukopf.com
2. Reject cookies → Pixel should NOT load
3. Clear cookies and visit again
4. Accept cookies → Pixel should load

**B. Install Meta Pixel Helper**
1. Install [Meta Pixel Helper Chrome Extension](https://chrome.google.com/webstore/detail/meta-pixel-helper/)
2. Visit https://leeukopf.com (after accepting cookies)
3. Click extension icon
4. Verify: Pixel is Active, PageView events appear

**C. Test Form Submission**
1. Navigate to Client Registration page
2. Fill out and submit form
3. After success message, check Meta Pixel Helper
4. Verify: Lead event appears

**D. Check Meta Events Manager**
1. Go to https://business.facebook.com/events_manager2
2. Select your pixel
3. View "Events" tab
4. Verify: PageView and Lead events appear

## 📊 What Events Fire

### Automatic Events

- **PageView**: Fires on initial page load (after consent)
- **PageView**: Fires on every route change

### Form Events

- **Lead**: Fires after successful Client Registration form submission

## 🔍 Development Mode

When running `npm run dev`:
- Pixel doesn't actually load (prevents dev data in analytics)
- Console logs show what would happen:
  ```
  [Meta Pixel] Development mode detected, skipping initialization
  ```

## 🎯 Key Features

✅ **Cookie Consent Integration**
- Respects user privacy
- Only loads with explicit consent
- GDPR compliant

✅ **Domain Validation**
- Only fires on leeukopf.com
- Prevents duplicate tracking

✅ **Lead Tracking**
- Fires on form submission success
- Never fires on page load
- Structured event data

✅ **Development Logging**
- Visible in dev mode
- Silent in production
- Helps debugging

✅ **CAPI Ready**
- Code structured for future server-side tracking
- Prevents ad blocker issues
- Improves tracking accuracy

## 📚 Full Documentation

See [META_PIXEL_IMPLEMENTATION.md](./META_PIXEL_IMPLEMENTATION.md) for complete details.

## ❓ Troubleshooting

**Pixel not loading?**
- Check VITE_META_PIXEL_ID is set correctly
- Ensure cookies are accepted
- Verify domain is leeukopf.com
- Check browser console for errors

**Events not appearing in Meta Events Manager?**
- Wait 5-10 minutes for events to process
- Verify Pixel ID matches in Meta Dashboard
- Check "Test Events" tab for real-time data
- Ensure cookies were accepted before navigation

**Lead event not firing?**
- Verify form submission was successful
- Check browser console (dev mode) for event logs
- Ensure you're on leeukopf.com domain
- Try Meta Pixel Helper to see events in real-time

## 🔮 Future Enhancements

Not implemented yet (as per requirements):
- **Meta Conversions API**: Server-side event mirroring
- **Additional Events**: AddToCart, Purchase, etc.
- **Advanced Attribution**: Custom event parameters

Code is prepared for these features when needed.

---

**Need Help?** Check the full documentation in META_PIXEL_IMPLEMENTATION.md
