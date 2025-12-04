# Product Categories Visibility Configuration

## Overview

The product categories on the website are controlled by a central configuration file that allows you to enable/disable categories and subcategories without removing any code. This is useful for gradually rolling out new product sections as content and assets become available.

## Configuration File Location

`src/config/productCategories.ts`

## How to Enable/Disable Categories

### Main Product Categories

To control which main product categories appear on the `/products` page, edit the `enabledCategories` object:

```typescript
export const enabledCategories = {
  gelPolish: true,                    // Currently enabled
  builderAndStructureGels: false,     // Hidden until ready
  topAndBases: false,                 // Hidden until ready
  polygelAcrygel: false,              // Hidden until ready
  acrylicSystems: false,              // Hidden until ready
  liquidsAndSolutions: false,         // Hidden until ready
  nailArt: false,                     // Hidden until ready
  accessories: false,                 // Hidden until ready
};
```

Simply change `false` to `true` to enable a category.

### Subcategories

To control subcategories within Builder & Structure Gels and Top & Bases, edit the `enabledSubcategories` object:

```typescript
export const enabledSubcategories = {
  // Builder & Structure Gels subcategories
  builderGels: {
    threePhase: false,
    threeInOne: false,
    premiumFiberGlass: false,
  },
  
  // Top & Bases subcategories
  topCoats: {
    enabled: false,     // Main Top Coats page
    standard: false,
    effects: false,
  },
  baseCoats: {
    enabled: false,     // Main Base Coats page
    classic: false,
    rubberBase: false,
    superiorBase: false,
  },
};
```

## Recommended Rollout Sequence

### Phase 1: Enable Main Categories
1. Start with categories that have complete assets and content ready
2. Enable one category at a time: `builderAndStructureGels: true`
3. Test the category page
4. Move to the next category

### Phase 2: Enable Subcategories
1. Once a main category is enabled, you can gradually enable its subcategories
2. For Builder & Structure Gels:
   - Enable `threePhase: true`
   - Test the subcategory page
   - Enable remaining subcategories one by one

3. For Top & Bases:
   - Enable the main subcategory page first: `enabled: true`
   - Then enable individual product pages

## Example: Enabling Builder & Structure Gels

### Step 1: Enable Main Category
```typescript
builderAndStructureGels: true,
```

This will show the "Builder & Structure Gels" card on `/products` and make the `/products/builder-and-structure-gels` page accessible.

### Step 2: Enable Subcategories
```typescript
builderGels: {
  threePhase: true,
  threeInOne: true,
  premiumFiberGlass: true,
},
```

This will show all three subcategory cards on the Builder & Structure Gels page.

## Testing

After making changes to `src/config/productCategories.ts`:

1. Save the file
2. The development server will automatically reload
3. Navigate to `/products` to verify the changes
4. Test that enabled categories appear and disabled ones don't
5. Test that subcategory pages work correctly

## Important Notes

- **No Code Removal**: Never remove category code. Just toggle the visibility flags.
- **Assets Required**: Before enabling a category, ensure images and content are ready.
- **Subcategory Dependencies**: Subcategories will only show if their parent category is also enabled.
- **Links Still Work**: Even if a category is disabled, direct links to its URL will still work for testing.

## Quick Reference

| Category | Config Key | Route |
|----------|-----------|-------|
| Gel Polish | `gelPolish` | `/products/gel-polish` |
| Builder & Structure Gels | `builderAndStructureGels` | `/products/builder-and-structure-gels` |
| Top & Bases | `topAndBases` | `/products/top-and-bases` |
| Polygel / AcryGel | `polygelAcrygel` | `/products/polygel-acrygel` |
| Acrylic Systems | `acrylicSystems` | `/products/acrylic-systems` |
| Liquids & Solutions | `liquidsAndSolutions` | `/products/liquids-and-solutions` |
| Nail Art | `nailArt` | `/products/nail-art` |
| Accessories | `accessories` | `/products/accessories` |

## Questions or Issues?

If you encounter any issues with the visibility configuration, check:
1. The config file syntax is correct (no missing commas, brackets, etc.)
2. The key names match exactly (case-sensitive)
3. The values are boolean (`true` or `false`, not strings)
