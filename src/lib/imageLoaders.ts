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
 * Extract number from filename for sorting (e.g., "gel (10).jpg" -> 10)
 * Returns 0 for "clear" to place it first, Infinity for others
 */
function extractSortNumber(filename: string): number {
  // Check if it's the clear variant (should be first)
  if (filename.toLowerCase().includes('clear')) {
    return 0;
  }
  
  // Extract number from pattern like "(10)" or "(2)"
  const match = filename.match(/\((\d+)\)/);
  if (match) {
    return parseInt(match[1], 10);
  }
  
  // If no number found, place at end
  return Infinity;
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

  // Sort images by extracted number for proper ordering
  productImages.sort((a, b) => {
    const numA = extractSortNumber(a.src);
    const numB = extractSortNumber(b.src);
    return numA - numB;
  });

  return productImages;
}
