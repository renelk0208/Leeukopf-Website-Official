/**
 * Common responsive sizes presets for different layouts
 * Used with the sizes attribute on img elements for responsive images
 */
export const RESPONSIVE_SIZES = {
  /** Full-width images on all screens */
  fullWidth: '100vw',
  /** Two-column layout (full on mobile, half on tablet+) */
  twoColumn: '(max-width: 640px) 100vw, 50vw',
  /** Three-column layout (full mobile, half tablet, third desktop) */
  threeColumn: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  /** Four-column layout */
  fourColumn: '(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw',
  /** Hero/carousel images (typically large) */
  hero: '(max-width: 768px) 100vw, 80vw',
  /** Thumbnail images */
  thumbnail: '(max-width: 640px) 50vw, 200px',
  /** Card images in a grid */
  card: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px',
} as const;
