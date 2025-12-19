/**
 * Instagram fallback image utilities
 * Provides brand-specific placeholder images for Instagram feeds
 */

type Brand = 'leeukopf' | 'gelitup';

/**
 * Validate that a path is safe for Instagram placeholders
 * @param path - The path to validate
 * @returns true if valid, false otherwise
 */
function validatePlaceholderPath(path: string): boolean {
  // Must not contain /products/ directory
  return !path.includes('/products/');
}

/**
 * Get brand-specific Instagram fallback images
 * These are displayed when the Instagram API is unavailable
 * 
 * @param brand - The brand identifier (leeukopf or gelitup)
 * @param count - Number of placeholders to return (default: 4)
 * @returns Array of image paths for fallback placeholders
 */
export function getInstagramFallbackImages(brand: Brand, count: number = 4): string[] {
  const basePath = `/img/instagram/${brand}/placeholder/webp`;
  
  // Build placeholder paths based on requested count
  const placeholders: string[] = [];
  for (let i = 1; i <= count; i++) {
    placeholders.push(`${basePath}/placeholder-${i}.webp`);
  }
  
  // Runtime safeguard: Ensure no placeholder path contains /products/
  // This prevents accidentally using product images as Instagram placeholders
  placeholders.forEach((path) => {
    if (!validatePlaceholderPath(path)) {
      const message = 
        `Invalid Instagram placeholder path detected: ${path}. ` +
        `Placeholder images must not be from the /products/ directory.`;
      
      if (process.env.NODE_ENV === 'development') {
        throw new Error(message);
      } else {
        console.warn(`[Instagram] ${message}`);
      }
    }
  });
  
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
  
  return validPattern.test(path) && validatePlaceholderPath(path);
}
