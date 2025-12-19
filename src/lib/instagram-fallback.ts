/**
 * Instagram fallback image utilities
 * Provides brand-specific placeholder images for Instagram feeds
 */

type Brand = 'leeukopf' | 'gelitup';

// CONSTANT: Always show exactly 4 placeholders
const PLACEHOLDER_COUNT = 4;

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
 * @returns Array of exactly 4 image paths for fallback placeholders
 */
export function getInstagramFallbackImages(brand: Brand): string[] {
  const basePath = `/img/instagram/${brand}/placeholder/webp`;
  
  // Build placeholder paths - always exactly PLACEHOLDER_COUNT items
  const placeholders = [
    `${basePath}/placeholder-1.webp`,
    `${basePath}/placeholder-2.webp`,
    `${basePath}/placeholder-3.webp`,
    `${basePath}/placeholder-4.webp`,
  ];
  
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
