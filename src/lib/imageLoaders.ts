/**
 * Utility functions for dynamically loading product images
 */

interface ProductImage {
  src: string;
  alt: string;
}

interface BuilderGelImageOptions {
  /** The glob pattern for image paths */
  globPattern: string;
  /** Optional filter pattern to match in filenames (e.g., '3-phase', 'colour') */
  filterPattern?: string;
  /** Prefix for alt text (e.g., '3-in-1 Builder Gel') */
  altPrefix: string;
}

/**
 * Load builder gel product images using Vite's import.meta.glob
 * @param imageModules - The result of import.meta.glob
 * @param options - Configuration options for filtering and labeling images
 * @returns Array of product images with src and alt text
 */
export function loadBuilderGelImages(
  imageModules: Record<string, { default: string }>,
  options: BuilderGelImageOptions
): ProductImage[] {
  const productImages: ProductImage[] = [];

  Object.keys(imageModules).forEach((path) => {
    // Skip if not jpg or jpeg
    if (!path.match(/\.jpe?g$/i)) return;

    const filename = path.split('/').pop() || '';
    const lowerFilename = filename.toLowerCase();

    // Skip category images
    if (lowerFilename.includes('category')) return;

    // If a filter pattern is specified, only include matching files
    if (options.filterPattern && !lowerFilename.includes(options.filterPattern)) {
      return;
    }

    // Convert the public path to a URL path (remove /public prefix)
    const imageSrc = path.replace('/public', '');

    // Generate a readable alt text from the filename
    const altText = filename
      .replace(/\.(jpg|jpeg)$/i, '')
      .replace(/[-_]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    productImages.push({
      src: imageSrc,
      alt: `${options.altPrefix} - ${altText}`,
    });
  });

  // Sort images by path for consistent ordering
  productImages.sort((a, b) => a.src.localeCompare(b.src));

  return productImages;
}
