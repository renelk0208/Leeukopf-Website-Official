import { ImgHTMLAttributes } from 'react';

interface SmartImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'loading' | 'decoding'> {
  /** Image source URL */
  src: string;
  /** Alt text for accessibility (required) */
  alt: string;
  /** Intrinsic width of the image (required for CLS prevention) */
  width: number;
  /** Intrinsic height of the image (required for CLS prevention) */
  height: number;
  /** 
   * Priority hint for the browser
   * Use "high" for hero/LCP images (above-the-fold)
   * @default "auto"
   */
  fetchPriority?: 'high' | 'low' | 'auto';
  /** 
   * Whether to lazy load the image
   * @default true (lazy loads for performance)
   * Set to false for above-the-fold images
   */
  lazy?: boolean;
  /** 
   * Sizes attribute for responsive images
   * @example "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 800px"
   */
  sizes?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * SmartImage component with built-in performance optimizations
 * 
 * Features:
 * - Lazy loading by default (can be disabled for above-fold images)
 * - Async decoding for non-blocking rendering
 * - Required width/height to prevent Cumulative Layout Shift (CLS)
 * - Optional fetchPriority for LCP optimization
 * 
 * @example
 * // Hero image (above the fold)
 * <SmartImage
 *   src="/hero.jpg"
 *   alt="Hero image"
 *   width={1920}
 *   height={1080}
 *   fetchPriority="high"
 *   lazy={false}
 * />
 * 
 * @example
 * // Standard image (below the fold)
 * <SmartImage
 *   src="/product.jpg"
 *   alt="Product image"
 *   width={800}
 *   height={600}
 * />
 */
export default function SmartImage({
  src,
  alt,
  width,
  height,
  fetchPriority = 'auto',
  lazy = true,
  sizes,
  className,
  style,
  ...rest
}: SmartImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      loading={lazy ? 'lazy' : 'eager'}
      decoding="async"
      fetchPriority={fetchPriority}
      className={className}
      style={{
        ...style,
        // Ensure images maintain aspect ratio and don't cause layout shifts
        aspectRatio: `${width} / ${height}`,
      }}
      {...rest}
    />
  );
}
