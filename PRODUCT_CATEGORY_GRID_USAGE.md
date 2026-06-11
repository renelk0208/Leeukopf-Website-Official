# Product Category Grid Component - Usage Guide

## Overview

The `ProductCategoryGrid` component is a generic, reusable component for displaying product categories in a responsive grid layout. It works with any product group defined in the data model.

## Location

- **Component**: `src/components/products/ProductCategoryGrid.tsx`
- **Data Model**: `src/data/productCategories.ts`
- **CSS Animations**: `src/index.css` (fade-in-image animation)

## Data Model

The `productCategories.ts` file contains all product categories across different groups:

```typescript
export type ProductCategory = {
  id: string;          // Unique identifier
  key: string;         // Internal key, used in URLs (kebab-case)
  displayName: string; // User-facing name
  imagePath: string;   // Path starting with /img/ from public
  group: string;       // e.g. "Gel Polish", "Builder Gels", etc.
};
```

### Available Groups

Currently defined groups:
- **Gel Polish** - 9 categories (glitters, pastels, nudes, etc.)
- **Builder Gels** - 5 categories (3-phase, 3-in-1, premium, etc.)
- **Primers & Liquids** - 4 categories (rubber bases, tops, etc.)
- **Accessories** - 1 category (nail art)

## Component Usage

### Basic Example

```tsx
import ProductCategoryGrid from '../components/products/ProductCategoryGrid';

function MyPage() {
  return (
    <ProductCategoryGrid
      group="Gel Polish"
      title="Gel Polish Collections"
      subtitle="From solids to glitters and pastels, discover our professional gel polish families."
      basePath="/products/gel-polish"
    />
  );
}
```

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `group` | string | Yes | - | The product group to display (must match a group in productCategories.ts) |
| `title` | string | No | Same as group | Heading text for the grid |
| `subtitle` | string | No | "Explore our curated ranges..." | Descriptive text below the heading |
| `basePath` | string | No | "/products" | Base URL prefix for category links |

### Multiple Groups on One Page

You can display multiple category groups on a single page:

```tsx
function ProductsPage() {
  return (
    <PageTemplate title="Our Products">
      {/* Gel Polish */}
      <ProductCategoryGrid
        group="Gel Polish"
        title="Gel Polish Collections"
        subtitle="Professional gel polishes in hundreds of shades."
        basePath="/products/gel-polish"
      />

      {/* Builder Gels */}
      <ProductCategoryGrid
        group="Builder Gels"
        title="Builder Gel Systems"
        subtitle="High-performance builder systems for strength and structure."
        basePath="/products/builder-gels"
      />
    </PageTemplate>
  );
}
```

## Live Demo

A test page is available at `/products/category-grid-test` that demonstrates all groups in action.

## Features

### Responsive Layout

The grid automatically adjusts based on screen size:
- **Mobile** (< 640px): 1 column
- **Tablet** (640px - 768px): 2 columns
- **Desktop** (768px - 1024px): 3 columns
- **Large Desktop** (1024px+): 4 columns

### Hover Effects

- Card lifts up slightly on hover
- Image scales up 3% with smooth transition
- Shadow increases
- "Explore category" link underlines

### Focus States

- Accessible focus ring using brand color (#A3005A)
- Keyboard navigation fully supported

### Image Loading

- Lazy loading enabled for better performance
- Fallback to placeholder image if category image fails to load
- Fade-in animation on image load (0.5s smooth transition)

### Empty State

If no categories are found for a group, a helpful message is displayed:
```
No categories available in this group yet.
```

## Adding New Categories

To add new categories to the grid:

1. Open `src/data/productCategories.ts`
2. Add a new entry to the `productCategories` array:

```typescript
{
  id: 'new-category',
  key: 'new-category',
  displayName: 'New Category',
  imagePath: '/img/products/category/image.jpg',
  group: 'Gel Polish', // or any other group
}
```

3. Ensure the image exists at the specified path in `public/`
4. The category will automatically appear in any grid using that group

## Adding New Groups

To add a completely new product group:

1. Add categories with the new group name to `productCategories.ts`:

```typescript
{
  id: 'acrylic-powder-clear',
  key: 'acrylic-powder-clear',
  displayName: 'Clear Acrylic Powder',
  imagePath: '/img/products/acrylics/clear.jpg',
  group: 'Acrylic Systems', // NEW GROUP
}
```

2. Use the grid component with the new group name:

```tsx
<ProductCategoryGrid
  group="Acrylic Systems"
  title="Acrylic Systems"
  subtitle="Professional acrylic powders and liquids."
  basePath="/products/acrylic-systems"
/>
```

## Styling

The component uses:
- **Brand Color**: `#A3005A` (fuchsia) for focus rings and CTAs
- **Tailwind CSS**: For all styling
- **Custom Animation**: `.fade-in-image` defined in `src/index.css`

### Customizing Colors

The component respects the global CSS variables defined in `src/index.css`:
- `--color-primary`: #A3005A
- `--color-neutral-*`: Various neutral shades for UI elements

## Image Requirements

### Recommended Specifications
- **Format**: JPG or PNG
- **Dimensions**: Square aspect ratio (e.g., 400x400px minimum)
- **Size**: Optimized for web (< 200KB recommended)
- **Location**: `public/img/products/[group]/`

### Placeholder Image
If an image fails to load, the component falls back to:
- **Path**: `/img/placeholders/category-placeholder.jpg`
- This ensures the grid never shows broken images

## Best Practices

1. **Group Names**: Use consistent group names across categories
2. **Image Paths**: Always start with `/img/` (from public root)
3. **Keys**: Use kebab-case for category keys (matching URL conventions)
4. **Display Names**: Use proper capitalization and spacing
5. **Base Paths**: Match your actual routing structure

## Accessibility

The component is fully accessible:
- ✅ Semantic HTML (section, article, headings)
- ✅ ARIA labels where appropriate
- ✅ Keyboard navigation support
- ✅ Focus indicators with brand colors
- ✅ Alt text for all images
- ✅ Proper heading hierarchy (h2 for grid title, h3 for categories)

## Performance

- **Lazy Loading**: Images load only when needed
- **Optimized CSS**: Uses Tailwind's utility classes
- **Minimal Re-renders**: Pure component with simple props
- **Fade Animation**: GPU-accelerated for smooth performance

## Migration from Old Components

If you have existing hardcoded category grids, follow these steps:

### Before (Hardcoded)
```tsx
<div className="grid grid-cols-4 gap-6">
  <Link to="/products/gel-polish/glitters">
    <img src="/img/glitters.jpg" />
    <h3>Glitters Collection</h3>
  </Link>
  {/* ... more hardcoded cards ... */}
</div>
```

### After (Using ProductCategoryGrid)
```tsx
<ProductCategoryGrid
  group="Gel Polish"
  basePath="/products/gel-polish"
/>
```

### Benefits
- ✅ Single source of truth for category data
- ✅ Consistent styling across all grids
- ✅ Easier to add/remove categories
- ✅ Better maintainability
- ✅ Automatic responsive behavior
- ✅ Built-in accessibility

## Troubleshooting

### Categories Not Showing

1. Check that categories exist in `productCategories.ts` with the correct `group` value
2. Ensure the `group` prop matches exactly (case-sensitive)
3. Verify images exist at the specified paths

### Images Not Loading

1. Check that image paths start with `/img/`
2. Verify files exist in `public/img/products/`
3. Check browser console for 404 errors
4. Ensure image filenames match exactly (case-sensitive on Linux)

### Styling Issues

1. Verify `src/index.css` contains the `.fade-in-image` animation
2. Check that Tailwind CSS is properly configured
3. Clear browser cache and rebuild: `npm run build`

## Example Pages

See these pages for real-world usage:
- `/products/category-grid-test` - Comprehensive test page showing all groups
- Implementation examples available in the codebase

## Support

For questions or issues:
1. Check this documentation
2. Review the test page implementation
3. Examine `src/data/productCategories.ts` for examples
4. Open an issue on the repository
