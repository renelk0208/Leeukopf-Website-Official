# Valentine's Seasonal Page - Asset Replacement Guide

## Overview
The Valentine's seasonal page is now live at `/seasonal/valentines/`. This guide explains how to replace placeholder assets with real content.

## Current Status
✅ Page structure complete
✅ All styling and animations implemented
✅ Hearts animation active (Feb 6-15, 2026)
✅ Responsive design working
⏳ Awaiting real assets from content team

## Assets to Replace

### 1. Hero Video and Poster
**Location:** `/public/seasonal/valentines/`

#### hero.mp4
- **Purpose:** Full-viewport background video for hero section
- **Specifications:**
  - Format: MP4 (H.264 codec recommended)
  - Resolution: 1920x1080 or higher (4K acceptable)
  - Duration: 5-15 seconds (will loop)
  - File size: Keep under 5MB for performance
  - Audio: None (video is muted)
  - Content: Should showcase gel polish bottles, romantic colors, or Valentine's theme
  
#### hero-poster.jpg
- **Purpose:** Fallback image shown while video loads
- **Specifications:**
  - Format: JPG
  - Resolution: Same as video (1920x1080 recommended)
  - File size: Keep under 500KB
  - Content: A frame from the hero video, or similar themed image

### 2. Product Images
**Location:** `/public/seasonal/valentines/picks/`

Replace the 8 SVG placeholders with actual product images:
- `placeholder-1.svg` → `pick-1.jpg` (or keep existing names)
- `placeholder-2.svg` → `pick-2.jpg`
- ... and so on

**Specifications:**
- Format: JPG or WebP (WebP preferred for smaller file size)
- Resolution: 600x600px minimum (square aspect ratio)
- File size: Keep each under 200KB
- Content: Close-up shots of gel polish bottles or swatches
- Naming: Can use descriptive names like `romantic-rose.jpg`, `passion-pink.jpg`, etc.

**If using new names:** Update the HTML file at line 65-133 to reference new filenames.

### 3. Mood Block Images
**Location:** `/public/seasonal/valentines/`

Add two images for the "Explore by Mood" section:

#### mood-bold.jpg
- **Purpose:** Background for "Bold & Passionate" mood block
- **Specifications:**
  - Format: JPG
  - Resolution: 1200x800px minimum
  - File size: Keep under 300KB
  - Content: Dark, rich reds and burgundies; dramatic nail art or product shots

#### mood-romantic.jpg
- **Purpose:** Background for "Soft & Romantic" mood block
- **Specifications:**
  - Format: JPG
  - Resolution: 1200x800px minimum
  - File size: Keep under 300KB
  - Content: Soft pinks, nudes; delicate, elegant nail designs

### 4. Texture Video Loop
**Location:** `/public/seasonal/valentines/loops/`

#### texture-drip.mp4
- **Purpose:** Showcases gel polish viscosity and texture
- **Specifications:**
  - Format: MP4 (H.264 codec)
  - Resolution: 1920x1080 or 1280x720
  - Duration: 3-8 seconds (will loop seamlessly)
  - File size: Keep under 2MB
  - Audio: None (muted)
  - Content: Close-up of gel polish dripping or showing texture
  - Must loop smoothly (end frame should blend with start frame)

## How to Replace Assets

### Option 1: Direct Replacement
1. Place new assets in the appropriate directories
2. Use the same filenames as placeholders
3. Delete the `.txt` placeholder files
4. Rebuild and redeploy

### Option 2: Custom Filenames
1. Place new assets in the appropriate directories
2. Update `/public/seasonal/valentines/index.html`:
   - Line 38: `poster="/seasonal/valentines/hero-poster.jpg"`
   - Line 41: `<source src="/seasonal/valentines/hero.mp4"`
   - Lines 65-133: Update all 8 product image sources
   - Line 161: Update mood-bold.jpg path
   - Line 177: Update mood-romantic.jpg path
   - Line 213: Update texture-drip.mp4 path
3. Rebuild and redeploy

## File Size Budget
To maintain optimal performance:
- Total assets: ~10MB maximum
- Hero video: <5MB
- Hero poster: <500KB
- Each product image: <200KB
- Each mood image: <300KB
- Texture video: <2MB

## Image Optimization Tips
1. **Use WebP format** for images when possible (better compression)
2. **Compress JPG files** using tools like:
   - TinyJPG (online)
   - ImageOptim (Mac)
   - Squoosh (online, by Google)
3. **For videos:**
   - Use HandBrake or FFmpeg
   - H.264 codec with CRF 23-28
   - Resolution: 1080p maximum

## Testing After Asset Replacement
1. Build the site: `npm run build`
2. Preview locally: `npm run preview`
3. Check:
   - Hero video plays automatically
   - Poster image appears before video loads
   - All 8 product images display correctly
   - Mood block images load properly
   - Texture video loops smoothly
   - Page loads quickly (check Network tab in DevTools)

## Deployment
Once assets are replaced and tested:
1. Commit changes: `git add public/seasonal/valentines/ && git commit -m "Add real Valentine's assets"`
2. Push to main branch
3. Netlify will automatically rebuild and deploy
4. Verify at: `https://leeukopf.com/seasonal/valentines/`

## Questions?
Contact the development team if you need:
- Help with image optimization
- Custom image dimensions
- Video encoding assistance
- HTML updates for custom filenames

## Hearts Animation
The hearts falling effect is automatic:
- **Active:** Feb 6, 2026 00:00:00 to Feb 15, 2026 23:59:59 (local time)
- **Inactive:** Outside this date range
- No manual changes needed!
