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
 * @param count - Number of placeholders to return (default: 4, max: 8)
 * @returns Array of image paths for fallback placeholders
 */
export function getInstagramFallbackImages(brand: Brand, count: number = 4): string[] {
  const basePath = `/img/instagram/${brand}/placeholder`;
  
  // Validate count is within available range (we have placeholders 1-8)
  const maxPlaceholders = 8;
  const validatedCount = Math.min(Math.max(1, count), maxPlaceholders);
  
  if (count !== validatedCount) {
    console.warn(
      `[Instagram] Requested ${count} placeholders, but only ${maxPlaceholders} available. Using ${validatedCount}.`
    );
  }
  
  // Build placeholder paths based on validated count
  const placeholders: string[] = [];
  for (let i = 1; i <= validatedCount; i++) {
    placeholders.push(`${basePath}/placeholder-${i}.jpg`);
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
