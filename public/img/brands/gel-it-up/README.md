# GEL.IT.UP Brand Images

This folder contains images for the GEL.IT.UP brand page.

## Image Guidelines

### Required Images

Upload the following images to this folder:

1. **product-showcase-1.jpg** - Main product showcase image
2. **product-showcase-2.jpg** - Secondary product showcase image
3. **product-showcase-3.jpg** - Tertiary product showcase image

### Image Specifications

- **Format**: JPG or PNG
- **Recommended Size**: 1280x1280 pixels (square aspect ratio)
- **File Size**: Keep under 500KB for optimal web performance
- **Quality**: High quality, well-lit product photography

### Naming Convention

- Use lowercase letters
- Use hyphens (-) instead of spaces or underscores
- Be descriptive but concise
- Examples: 
  - `product-showcase-1.jpg`
  - `collection-autumn-winter.jpg`
  - `gel-polish-swatches.jpg`

## Usage

These images are displayed on the GEL.IT.UP brand page at:
- URL: https://leeukopf.com/our-brands/gel-it-up
- Component: `src/pages/brands/GelItUpPage.tsx`

The page includes:
- Brand logo display
- Product showcase gallery
- Brand story and features
- Call-to-action section

## Adding More Images

To add more images to the gallery:

1. Upload your images to this folder
2. Update the `brandImages` array in `src/pages/brands/GelItUpPage.tsx`
3. Follow the existing format:

```typescript
{
  src: '/img/brands/gel-it-up/your-image-name.jpg',
  alt: 'Descriptive alt text for accessibility'
}
```

## Notes

- All images are served from the `/public` directory
- The path in code starts with `/img/brands/gel-it-up/`
- Images have error handling that shows a placeholder if the file is missing
- For best results, optimize images before uploading
