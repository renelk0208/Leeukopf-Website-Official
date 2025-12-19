/**
 * Instagram fallback image utilities
 * Provides brand-specific placeholder images for Instagram feeds
 */

type Brand = 'leeukopf' | 'gelitup';

/**
 * Get brand-specific Instagram fallback images
 * These are displayed when the Instagram API is unavailable
 * 
 * @param brand - The brand identifier (leeukopf or gelitup)
 * @returns Array of image paths for fallback placeholders
 */
export function getInstagramFallbackImages(brand: Brand): string[] {
  const basePath = `/img/instagram/${brand}/placeholder`;
  
  // Build placeholder paths
  const placeholders = [
    `${basePath}/placeholder-1.jpg`,
    `${basePath}/placeholder-2.jpg`,
    `${basePath}/placeholder-3.jpg`,
    `${basePath}/placeholder-4.jpg`,
  ];
  
  // Runtime safeguard: Ensure no placeholder path contains /products/
  // This prevents accidentally using product images as Instagram placeholders
  if (process.env.NODE_ENV === 'development') {
    placeholders.forEach((path) => {
      if (path.includes('/products/')) {
        throw new Error(
          `Invalid Instagram placeholder path detected: ${path}. ` +
          `Placeholder images must not be from the /products/ directory.`
        );
      }
    });
  } else {
    // In production, log warning instead of throwing
    placeholders.forEach((path) => {
      if (path.includes('/products/')) {
        console.warn(
          `[Instagram] Invalid placeholder path: ${path}. ` +
          `Using generic fallback instead.`
        );
      }
    });
  }
  
  return placeholders;
}

/**
 * Validate that a path is a valid Instagram placeholder path
 * 
 * @param path - The path to validate
 * @returns true if valid, false otherwise
 */
export function isValidInstagramPlaceholder(path: string): boolean {
  // Must be under /img/instagram/{brand}/placeholder/
  const validPattern = /^\/img\/instagram\/(leeukopf|gelitup)\/placeholder\//;
  
  // Must not contain /products/
  const invalidPattern = /\/products\//;
  
  return validPattern.test(path) && !invalidPattern.test(path);
}
