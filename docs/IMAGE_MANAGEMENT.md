# Image Management System

## Overview

The Leeukopf Website uses a centralized image management system to ensure consistency, prevent broken image links, and simplify maintenance. All product and hero images are managed through the `src/config/imageMap.ts` file.

## Architecture

### Structure

```
src/config/imageMap.ts          # Central image mapping configuration
public/img/
  ├── hero/                      # Page hero/banner images
  ├── products/                  # Product images
  │   ├── gel_polishes/          # Gel polish collections
  │   ├── builder-systems/       # Builder systems
  │   ├── tops-and-bases/        # Top & base coats
  │   ├── primers-and-liquids/   # Primers and liquids
  │   ├── nail-art/              # Nail art products
  │   └── Lamps/                 # UV/LED lamps
  └── placeholders/              # Fallback placeholder images
```

### Image Map Configuration

The `imageMap.ts` exports several key mappings:

1. **`categoryHero`** - Main category representative images
2. **`subcategoryImages`** - Arrays of images for specific collections
3. **`productPlaceholder`** - Fallback images by category
4. **`heroImages`** - Page-level hero/banner images

## Helper Functions

### `getImage(category, subcategory?, productImage?)`

Retrieves an image with automatic fallback logic.

**Fallback Chain:**
1. Use `productImage` if provided
2. Try subcategory first image if available
3. Try category hero image
4. Use category placeholder
5. Final fallback to default placeholder

**Example:**
```typescript
import { getImage } from '../config/imageMap';

// Get category image
const categoryImg = getImage('gel-polish');

// Get subcategory image
const subcatImg = getImage('gel-polish', 'cat-eye-collection');

// Use specific product image with fallback
const productImg = getImage('gel-polish', 'cat-eye-collection', myProduct.customImage);
```

### `getHeroImage(page, fallback?)`

Retrieves a hero/banner image for a page.

**Example:**
```typescript
import { getHeroImage } from '../config/imageMap';

const heroSrc = getHeroImage('about-us');
```

### `getSubcategoryImages(category, subcategory)`

Gets all images for a specific subcategory/collection.

**Example:**
```typescript
import { getSubcategoryImages } from '../config/imageMap';

const autumnImages = getSubcategoryImages('gel-polish', 'autumn-winter-25-26');
// Returns array of image paths
```

## Usage in Components

### Product Category Grid

```typescript
import { getImage, productPlaceholder } from '../../config/imageMap';

<img
  src={category.imagePath || getImage(category.key)}
  alt={category.displayName}
  loading="lazy"
  onError={(e) => {
    e.currentTarget.src = productPlaceholder['default'];
  }}
/>
```

### Product Pages

```typescript
import { categoryHero, getSubcategoryImages } from '../../config/imageMap';

// Hero image
<img src={categoryHero['gel-polish']} alt="Gel Polish" />

// Carousel images
const carouselImages = getSubcategoryImages('gel-polish', 'autumn-winter-25-26')
  .map((src, index) => ({ src, alt: `Collection ${index + 1}` }));
```

## Adding New Images

### Step 1: Add Images to Public Directory

Place images in the appropriate directory:
- Hero images: `public/img/hero/`
- Product images: `public/img/products/{category}/{subcategory}/`

### Step 2: Update imageMap.ts

Add entries to the appropriate mapping:

```typescript
// For category hero
export const categoryHero: Record<string, string> = {
  // ... existing entries
  'new-category': '/img/products/new-category/hero-image.jpg',
};

// For subcategory images
export const subcategoryImages: Record<string, Record<string, string[]>> = {
  'new-category': {
    'new-subcategory': [
      '/img/products/new-category/new-subcategory/image1.jpg',
      '/img/products/new-category/new-subcategory/image2.jpg',
    ],
  },
};

// For placeholders
export const productPlaceholder: Record<string, string> = {
  // ... existing entries
  'new-category': '/img/products/new-category/placeholder.jpg',
};
```

### Step 3: Verify Images Exist

All paths in `imageMap.ts` should correspond to actual files in `public/img/`.

## Best Practices

### 1. Use Centralized Mappings

✅ **Do:** Import from imageMap
```typescript
import { categoryHero } from '../../config/imageMap';
<img src={categoryHero['gel-polish']} />
```

❌ **Don't:** Hardcode paths
```typescript
<img src="/img/products/gel_polishes/gel_polish_category_1.jpg" />
```

### 2. Always Include Lazy Loading

```typescript
<img src={imageSrc} loading="lazy" alt="Description" />
```

### 3. Provide Meaningful Alt Text

```typescript
<img
  src={categoryHero['gel-polish']}
  alt="Professional Gel Polish Collection"
  loading="lazy"
/>
```

### 4. Use Error Handling

```typescript
<img
  src={category.imagePath || getImage(category.key)}
  alt={category.displayName}
  onError={(e) => {
    e.currentTarget.src = productPlaceholder['default'];
  }}
/>
```

### 5. Organize Images by Category

Keep directory structure organized:
```
public/img/products/
  gel_polishes/
    Cat Eye Collection/
    Glitters Collection/
    Solid Colour Collection/
  builder-systems/
    Acrygel/
    Builder Gels/
```

## Image Optimization

### Recommended Formats
- **JPEG**: For photos and product images (smaller file size)
- **PNG**: For graphics with transparency
- **WebP**: For modern browsers (best compression)

### Size Guidelines
- Hero images: Max 1920px width
- Category tiles: Max 800px width
- Product detail: Max 1200px width
- Thumbnails: Max 400px width

### Compression
Use tools like:
- [TinyPNG](https://tinypng.com/)
- [ImageOptim](https://imageoptim.com/)
- [Squoosh](https://squoosh.app/)

Target compression:
- JPEG quality: 80-85%
- Keep file size under 500KB for category images
- Keep file size under 200KB for thumbnails

## Troubleshooting

### Images Not Loading

1. **Check file path**: Verify the path in `imageMap.ts` matches the actual file location
2. **Check file name**: Ensure exact match including capitalization and spaces
3. **Check file extension**: Verify `.jpg`, `.jpeg`, `.png`, or `.webp`

### 404 Errors

1. Check browser console for exact path being requested
2. Verify file exists in `public/img/`
3. Check for typos in `imageMap.ts`
4. Ensure build copied images correctly

### Fallback Not Working

1. Verify `productPlaceholder['default']` exists
2. Check `onError` handler is implemented
3. Ensure fallback image path is correct

## Maintenance

### Regular Tasks

1. **Audit unused images**: Periodically check for images in `public/img/` not referenced in `imageMap.ts`
2. **Optimize large images**: Use build warnings to identify large files
3. **Update fallbacks**: Ensure placeholder images are appropriate
4. **Verify links**: Check that all images load correctly

### Version Control

- Commit images with descriptive names
- Group related image additions in single commits
- Document image sources in commit messages
- Keep imageMap.ts in sync with actual files

## Future Enhancements

Potential improvements:
- Automatic image map generation script
- WebP conversion pipeline
- Responsive image srcsets
- Image CDN integration
- Automated compression on build
- Image lazy loading improvements
