# PNG to WebP Conversion Guide

## Overview
This guide explains how to convert large PNG files to WebP format to improve website performance and reduce file sizes.

## Why Convert to WebP?
- **Smaller file sizes**: WebP typically provides 25-35% better compression than PNG
- **Faster page loads**: Reduced file sizes lead to faster loading times
- **Better performance**: Improved Lighthouse scores and Core Web Vitals

## Files to Convert

Based on the build output, the following PNG files are larger than 1MB and should be converted:

### Lamp Products (Comfort Plus L3)
Located in: `/public/img/products/Lamps/Comfort PlusL3/`
- `comfort-plus-product-image (1).png` - 1,139 KB
- `comfort-plus-product-image (2).png` - 1,923 KB
- `comfort-plus-product-image (4).png` - 1,318 KB
- `comfort-plus-product-image (5).png` - 1,292 KB
- `comfort-plus-product-image (6).png` - 1,303 KB
- `comfort-plus-product-image (7).png` - 1,219 KB
- `comfort-plus-product-image (8).png` - 1,259 KB
- `comfort-plus-product-image (9).png` - 1,298 KB
- `comfort-plus-product-image (10).png` - 1,331 KB

### Category Images
- `/public/img/products/Lamps/l3-lamp-category-image.png` - 1,292 KB
- `/public/img/products/liquids-&-solutions/liquids-&-solutions-category-card-image.png` - 1,417 KB
- `/public/img/products/builder-systems/Acrygel-Polygel/acrygel-polygel-category-card-image.png` - 2,132 KB

## Conversion Methods

### Option 1: Using Node.js (Sharp)

1. Install Sharp:
```bash
npm install --save-dev sharp
```

2. Create conversion script `scripts/convert-png-to-webp.js`:
```javascript
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const files = [
  'public/img/products/Lamps/Comfort PlusL3/comfort-plus-product-image (1).png',
  'public/img/products/Lamps/Comfort PlusL3/comfort-plus-product-image (2).png',
  // ... add all files to convert
];

async function convertToWebP(filePath) {
  const outputPath = filePath.replace('.png', '.webp');
  await sharp(filePath)
    .webp({ quality: 85 })
    .toFile(outputPath);
  console.log(`✓ Converted: ${outputPath}`);
}

Promise.all(files.map(convertToWebP))
  .then(() => console.log('All files converted!'))
  .catch(err => console.error('Error:', err));
```

3. Run the script:
```bash
node scripts/convert-png-to-webp.js
```

### Option 2: Using ImageMagick (Command Line)

1. Install ImageMagick:
```bash
# macOS
brew install imagemagick

# Ubuntu/Debian
sudo apt-get install imagemagick

# Windows
# Download from: https://imagemagick.org/script/download.php
```

2. Convert a single file:
```bash
convert input.png -quality 85 output.webp
```

3. Convert all PNG files in a directory:
```bash
cd public/img/products/Lamps/Comfort\ PlusL3/
for file in *.png; do
  convert "$file" -quality 85 "${file%.png}.webp"
done
```

### Option 3: Using Online Tools

If you prefer not to install tools locally:
1. Visit https://squoosh.app/ or https://cloudconvert.com/png-to-webp
2. Upload PNG files
3. Configure WebP quality (85% recommended)
4. Download converted WebP files
5. Replace original files or update references

## After Conversion

### Update Image References

After converting images, update the image map in `src/config/imageMap.ts`:

```typescript
// Before:
'/img/products/Lamps/Comfort PlusL3/comfort-plus-product-image (1).png',

// After:
'/img/products/Lamps/Comfort PlusL3/comfort-plus-product-image (1).webp',
```

### Optional: Keep PNG as Fallback

For maximum compatibility, you can keep both PNG and WebP files and use the `<picture>` element:

```html
<picture>
  <source srcset="image.webp" type="image/webp">
  <img src="image.png" alt="Fallback">
</picture>
```

However, modern browsers (95%+ coverage) support WebP, so this is usually not necessary.

## Testing

After conversion:

1. **Build the project:**
```bash
npm run build
```

2. **Check file sizes:**
```bash
ls -lh dist/assets/*.webp
```

3. **Test locally:**
```bash
npm run preview
```

4. **Verify images display correctly** in multiple browsers

## Expected Results

- PNG files: ~1.1-1.9 MB each
- WebP files (85% quality): ~300-700 KB each (60-70% reduction)
- Total savings: 5-10 MB across all converted files
- Improved Lighthouse performance score

## Browser Support

WebP is supported by:
- Chrome/Edge: All versions
- Firefox: 65+
- Safari: 14+ (macOS 11+, iOS 14+)
- Opera: All versions

Coverage: 97%+ of global users (as of 2024)

## Troubleshooting

**Images don't display after conversion:**
- Check file paths are correct
- Verify WebP files were created successfully
- Clear browser cache

**Quality issues:**
- Increase quality setting (try 90-95)
- Compare side-by-side with original
- Some images may require higher quality settings

**Build errors:**
- Ensure all file references are updated
- Check for typos in file paths
- Verify WebP files exist in the correct locations

## Additional Resources

- [WebP Documentation](https://developers.google.com/speed/webp)
- [Sharp Documentation](https://sharp.pixelplumbing.com/)
- [ImageMagick Documentation](https://imagemagick.org/index.php)
- [Can I Use WebP](https://caniuse.com/webp)
