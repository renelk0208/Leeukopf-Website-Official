# Category Image Guide

This guide explains how category images work in the Leeukopf website and how to properly configure them.

## Overview

Category images are used in two main places:
1. **Category cards** on the main Products page (`/products`)
2. **Category thumbnails** in the Gel Polish Category Gallery

## Where to Store Category Images

Category images should be stored in the `public/img/products/` directory, organized by product category:

```
public/img/products/
├── gel_polishes/
│   ├── Cat Eye Collection/
│   ├── Cream Collection/
│   ├── Glitters Collection/
│   ├── Glow In the Dark/
│   ├── Platinum Gel Polish/
│   ├── Solid Colour Collection/
│   ├── Thermo Mood Changing/
│   ├── Transparent Color Gel Polish/
│   └── autumn_winter_25_26/
├── builder-systems/
├── tops-and-bases/
├── nail-art/
└── ...
```

## Naming Conventions

### Option 1: Explicit Category Image (Recommended)
Create a file with "category" in the filename:
- `category-image.jpg`
- `[category-name]-category.jpg`
- `[category-name]_category_image.jpg`

**Examples:**
- `/img/products/gel_polishes/Glitters Collection/glitters_category_image.jpg`
- `/img/products/tops-and-bases/rubber-base-category-image.jpg`
- `/img/products/nail-art/nail-art-category-image.jpg`

### Option 2: First Image in Folder (Fallback)
If no explicit category image exists, the **first image alphabetically** in the category folder will be used as the thumbnail.

**Example:** For "Glow In the Dark" gel polish, if no category image exists, the file `angel_glow_gel_polish.jpg` would be used (first alphabetically).

## Configuration Files

To add or update category images, you need to modify three files:

### 1. productCategories.ts
Define the category metadata and image path:

```typescript
// src/data/productCategories.ts
{
  id: 'glow-in-the-dark',
  key: 'glow-in-the-dark',
  displayName: 'Glow In the Dark',
  imagePath: '/img/products/gel_polishes/Glow In the Dark/glow_in_dark_gel_polish.jpg',
  group: 'Gel Polish',
}
```

**Important:**
- `id` and `key` should be kebab-case (lowercase with hyphens)
- `displayName` is the human-readable title shown on the website
- `imagePath` must start with `/img/` (no `/public/` prefix needed)
- `group` determines which section the category appears in

### 2. imageMap.ts
Add the category hero image and subcategory images:

```typescript
// src/config/imageMap.ts

// In categoryHero section:
'glow-in-the-dark': '/img/products/gel_polishes/Glow In the Dark/glow_in_dark_gel_polish.jpg',

// In subcategoryImages section (under 'gel-polish'):
'glow-in-the-dark': [
  '/img/products/gel_polishes/Glow In the Dark/glow_in_dark_gel_polish.jpg',
  '/img/products/gel_polishes/Glow In the Dark/angel_glow_gel_polish.jpg',
  '/img/products/gel_polishes/Glow In the Dark/circular_pearl_glow__in_dark_gel_polish.jpg',
  // ... more images
],
```

### 3. GelPolishCategoryGallery.tsx (for Gel Polish only)
For gel polish categories specifically, add to the GEL_POLISH_CATEGORIES array:

```typescript
// src/components/GelPolishCategoryGallery.tsx
{
  id: 'glowInTheDark',
  folder: 'Glow In the Dark',
  title: 'Glow In the Dark',
  description: 'Luminescent gel polishes that glow in the dark'
},
```

**Note:** The `folder` must match the actual folder name in `public/img/products/gel_polishes/`

## Image Requirements

### Technical Specifications
- **Format:** JPG or JPEG (PNG supported but not recommended for photos)
- **Recommended Size:** 800x800 pixels minimum
- **Aspect Ratio:** Square (1:1) works best for category cards
- **File Size:** Optimize for web (< 500KB recommended)

### Content Guidelines
- Use clear, high-quality product images
- Show the product in good lighting
- Avoid excessive text overlays
- Ensure consistent style across categories

## Testing Your Changes

After adding or updating category images:

1. **Type Check:**
   ```bash
   npm run typecheck
   ```

2. **Lint:**
   ```bash
   npm run lint
   ```

3. **Build:**
   ```bash
   npm run build
   ```

4. **Preview:**
   ```bash
   npm run preview
   ```
   Then open http://localhost:4173 to view the site

5. **Verify:**
   - Check the Products page (`/products`) - category cards should display
   - Check the Gel Polish page (`/products/gel-polish`) - category gallery should show all subcategories
   - Click on category cards to ensure they link to the correct pages

## Common Issues

### Category Image Not Showing

**Symptom:** Category shows placeholder image or broken image

**Causes:**
1. Image path in `productCategories.ts` is incorrect
2. Image file doesn't exist at the specified path
3. Filename has spaces or special characters causing issues
4. Path includes `/public/` prefix (should start with `/img/`)

**Solution:**
- Verify the file exists: `ls public/img/products/...`
- Check the path exactly matches in the config file
- Remove `/public/` from paths if present
- Use URL-encoded filenames or rename files without special characters

### Category Not Appearing in Gallery

**Symptom:** Category doesn't show in the gel polish category gallery

**Causes:**
1. Not added to `GelPolishCategoryGallery.tsx`
2. Folder name doesn't match configuration
3. No images in the folder

**Solution:**
- Add the category to the `GEL_POLISH_CATEGORIES` array
- Ensure `folder` property exactly matches the folder name
- Verify images exist in the folder

### Duplicate Key Errors

**Symptom:** TypeScript errors about duplicate object keys

**Causes:**
- Same category key defined multiple times in `imageMap.ts` or `productCategories.ts`

**Solution:**
- Remove duplicate entries, keeping only one definition per category

## Best Practices

1. **Consistent Naming:** Use kebab-case for folder names and file names when possible
2. **Image Optimization:** Compress images before uploading to reduce page load times
3. **Descriptive Filenames:** Use clear, descriptive names like `ruby-red-gel-polish.jpg`
4. **Test Locally:** Always test changes locally before committing
5. **Version Control:** Commit image files separately from code changes when possible
6. **Documentation:** Update this guide if you establish new conventions

## Example: Adding a New Gel Polish Category

Let's add a "Metallic Collection" gel polish category:

1. **Create folder and add images:**
   ```
   public/img/products/gel_polishes/Metallic Collection/
   ├── metallic-gold.jpg
   ├── metallic-silver.jpg
   ├── metallic-bronze.jpg
   └── metallic-category-image.jpg
   ```

2. **Update productCategories.ts:**
   ```typescript
   {
     id: 'metallic-collection',
     key: 'metallic-collection',
     displayName: 'Metallic Collection',
     imagePath: '/img/products/gel_polishes/Metallic Collection/metallic-category-image.jpg',
     group: 'Gel Polish',
   }
   ```

3. **Update imageMap.ts:**
   ```typescript
   // In categoryHero:
   'metallic-collection': '/img/products/gel_polishes/Metallic Collection/metallic-category-image.jpg',
   
   // In subcategoryImages under 'gel-polish':
   'metallic-collection': [
     '/img/products/gel_polishes/Metallic Collection/metallic-category-image.jpg',
     '/img/products/gel_polishes/Metallic Collection/metallic-gold.jpg',
     '/img/products/gel_polishes/Metallic Collection/metallic-silver.jpg',
     '/img/products/gel_polishes/Metallic Collection/metallic-bronze.jpg',
   ],
   ```

4. **Update GelPolishCategoryGallery.tsx:**
   ```typescript
   {
     id: 'metallicCollection',
     folder: 'Metallic Collection',
     title: 'Metallic Collection',
     description: 'Metallic gel polishes with stunning mirror-like shine'
   },
   ```

5. **Test and commit:**
   ```bash
   npm run typecheck
   npm run lint
   npm run build
   git add .
   git commit -m "Add Metallic Collection gel polish category"
   ```

## Questions?

If you have questions about category images or run into issues not covered here:
1. Check the existing code for similar examples
2. Review the error messages carefully
3. Consult the main README.md for general setup information
4. Open an issue with the "question" label
