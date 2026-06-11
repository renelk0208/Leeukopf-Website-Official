# Facebook Link Preview Fix Guide

This guide explains how to fix Facebook link preview issues for the Leeukopf Laboratories website.

## Current Open Graph Configuration

The website already has all required Open Graph meta tags configured in `index.html`:

```html
<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:url" content="https://leeukopf.com/" />
<meta property="og:title" content="Leeukopf Laboratories - Premium Gel Polish Manufacturing" />
<meta property="og:description" content="Premium gel polish manufacturer offering high-quality nail products, private label services, and innovative formulations. Certified factory with global distribution." />
<meta property="og:image" content="https://leeukopf.com/img/hero/home-page-hero.jpg" />
<meta property="og:image:secure_url" content="https://leeukopf.com/img/hero/home-page-hero.jpg" />
<meta property="og:image:type" content="image/jpeg" />
<meta property="og:image:width" content="2000" />
<meta property="og:image:height" content="848" />
<meta property="og:image:alt" content="Leeukopf Laboratories - Premium Gel Polish Manufacturing" />
<meta property="og:site_name" content="Leeukopf Laboratories" />
<meta property="og:locale" content="en_US" />
```

## Recent Fix Applied

**URL Canonicalization**: Updated all Open Graph and Twitter Card meta tags to use `https://leeukopf.com/` (without www) instead of `https://www.leeukopf.com/`. This prevents issues caused by the redirect from www to non-www domain.

Added canonical link tag: `<link rel="canonical" href="https://leeukopf.com/" />`

## Why Facebook Link Previews May Not Work

Facebook link previews may not work due to several reasons:

1. **Facebook Cache**: Facebook caches link previews and may show old/stale data
2. **Image Requirements**: Facebook has specific image requirements (min 1200x630px recommended)
3. **First Crawl**: Facebook needs to crawl the page at least once to generate a preview
4. **SSL Certificate**: The site must have a valid SSL certificate (HTTPS)

## How to Fix Facebook Link Previews

### Step 1: Use Facebook Sharing Debugger

1. Go to [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
2. Enter your website URL: `https://leeukopf.com/` (without www)
3. Click "Debug" button
4. Review any errors or warnings shown
5. Click "Scrape Again" button to force Facebook to re-fetch the page

### Step 2: Verify Image Accessibility

1. Ensure the Open Graph image is publicly accessible at:
   `https://leeukopf.com/img/hero/home-page-hero.jpg` (without www)
2. Open the image URL in a browser to verify it loads correctly
3. Check that the image is at least 1200x630 pixels (current: 2000x848 ✓)
4. Verify the image is under 8MB in size

### Step 3: Test the Preview

After using the Sharing Debugger:

1. Try sharing the link on Facebook
2. The preview should now show correctly
3. If it doesn't, click "Scrape Again" in the debugger

### Step 4: Clear Facebook Cache (if needed)

If the preview still doesn't work:

1. Go to the [Sharing Debugger](https://developers.facebook.com/tools/debug/)
2. Click the "Batch Invalidator" tab
3. Enter your URL(s)
4. Click "Invalidate URLs"

## Common Issues and Solutions

### Issue: Old preview shows up

**Solution**: Use the Facebook Sharing Debugger and click "Scrape Again"

### Issue: Image doesn't show

**Solution**: 
- Verify the image URL is publicly accessible
- Check that the image meets Facebook's size requirements
- Ensure the image is served over HTTPS

### Issue: Wrong title or description

**Solution**:
- Check the og:title and og:description meta tags in index.html
- Use the Sharing Debugger to re-fetch the page

### Issue: Preview works in debugger but not in actual Facebook posts

**Solution**:
- Wait a few minutes for Facebook's cache to update
- Try sharing the link again
- Make sure you're sharing the exact URL (with or without trailing slash)

## Verification Checklist

- [x] All Open Graph meta tags are present in `index.html`
- [x] URLs use canonical domain (https://leeukopf.com without www)
- [x] Canonical link tag added to prevent redirect issues
- [ ] Image is accessible at `https://leeukopf.com/img/hero/home-page-hero.jpg`
- [x] Image is at least 1200x630 pixels (current: 2000x848 ✓)
- [ ] Used Facebook Sharing Debugger to scrape the page
- [ ] No errors shown in Sharing Debugger
- [ ] Preview appears correctly when sharing on Facebook

## Additional Resources

- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Open Graph Protocol](https://ogp.me/)
- [Facebook Sharing Best Practices](https://developers.facebook.com/docs/sharing/webmasters/)

## Notes

- The current Open Graph configuration is **complete and correct**
- The main issue is likely Facebook's cache - use the Sharing Debugger to clear it
- If problems persist after using the debugger, check that the website is fully deployed and accessible
- Changes to Open Graph tags require using the Sharing Debugger to re-fetch
