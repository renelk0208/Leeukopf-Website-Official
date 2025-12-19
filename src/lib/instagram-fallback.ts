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
  const basePath = `/img/instagram/${brand}/placeholder`;
  
  // Build placeholder paths - always return exactly PLACEHOLDER_COUNT items
  const availablePlaceholders = [
    `${basePath}/placeholder-1.jpg`,
    `${basePath}/placeholder-2.jpg`,
    `${basePath}/placeholder-3.jpg`,
    `${basePath}/placeholder-4.jpg`,
  ];
  
  // Ensure we have exactly PLACEHOLDER_COUNT items
  let placeholders: string[] = [];
  
  if (availablePlaceholders.length >= PLACEHOLDER_COUNT) {
    // Take first PLACEHOLDER_COUNT items
    placeholders = availablePlaceholders.slice(0, PLACEHOLDER_COUNT);
  } else {
    // If we have fewer than PLACEHOLDER_COUNT, repeat items to reach exactly PLACEHOLDER_COUNT
    placeholders = [...availablePlaceholders];
    while (placeholders.length < PLACEHOLDER_COUNT) {
      placeholders.push(availablePlaceholders[placeholders.length % availablePlaceholders.length]);
    }
    // Ensure we don't exceed PLACEHOLDER_COUNT
    placeholders = placeholders.slice(0, PLACEHOLDER_COUNT);
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
