# No Heat Spike Builder Gel Category - Implementation Guide

## Status
The "No Heat Spike Builder Gel" category was mentioned in the requirements. This document outlines what needs to be done to add this category once the images are available.

## Required Images
1. Category card image for "No Heat Spike Builder Gel" category
   - Suggested path: `/public/img/products/tops-and-bases/No Heat Spike Builder Gel/no-heat-spike-builder-gel-category-card-image.jpg`
   - Should be similar dimensions to other category cards (aspect ratio 4:3)

2. Product images for the category
   - Place in: `/public/img/products/tops-and-bases/No Heat Spike Builder Gel/`
   - Format: `.jpg` or `.jpeg`
   - Avoid files with "category" in the filename (these are filtered out in product displays)

## Code Changes Needed

### 1. Update `src/config/imageMap.ts`
Add the following entry to the `categoryHero` object (around line 51-58):

```typescript
'no-heat-spike-builder-gel': '/img/products/tops-and-bases/No Heat Spike Builder Gel/no-heat-spike-builder-gel-category-card-image.jpg',
```

### 2. Update `src/config/productCategories.ts`
Add to the `enabledSubcategories.baseCoats` object (around line 39-44):

```typescript
noHeatSpikeBuilderGel: true, // Enable when images are available
```

### 3. Update `src/pages/products/top-bases/BaseCoatsPage.tsx`
Add the new category to the subcategories array (after line 29):

```typescript
{
  key: 'noHeatSpikeBuilderGel',
  title: 'No Heat Spike Builder Gel',
  path: '/products/top-and-bases/base-coats/no-heat-spike-builder-gel',
  description: 'Advanced formula that minimizes heat generation during curing — HEMA-free and TPO-free.',
  image: categoryHero['no-heat-spike-builder-gel'],
},
```

### 4. Create Page Component
Create a new file: `src/pages/products/top-bases/base-coats/NoHeatSpikeBuilderGelPage.tsx`

Use `RubberBasePage.tsx` or `ClassicBasePage.tsx` as a template. Update the glob pattern to:
```typescript
'/public/img/products/tops-and-bases/No Heat Spike Builder Gel/**/*.{jpg,JPG,jpeg,JPEG}'
```

### 5. Add Route in `src/App.tsx`
Add the route (around line 97):

```typescript
<Route path="/products/top-and-bases/base-coats/no-heat-spike-builder-gel" element={<NoHeatSpikeBuilderGelPage />} />
```

Don't forget to import the component at the top of the file.

### 6. Verification
After adding the images and code:
1. Run `npm run build` to ensure no errors
2. Run `npm run dev` and navigate to http://localhost:5173/products/top-and-bases/base-coats
3. Verify the "No Heat Spike Builder Gel" category card appears
4. Click on it to verify the product page loads correctly
5. If available, run `npm run audit:images` (currently has syntax errors)

## Notes
- The category will appear in the grid alongside Classic, Rubber Base, and Superior Base Coat
- Ensure the description and naming match the marketing materials
- The category name is specifically "No Heat Spike Builder Gel" as requested
