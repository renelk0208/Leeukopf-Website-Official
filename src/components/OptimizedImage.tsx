import { useState, useCallback, ImgHTMLAttributes } from 'react';

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'onError'> {
  /** Image source URL */
  src: string;
  /** Alt text for accessibility (required) */
  alt: string;
  /** Intrinsic width of the image for aspect ratio calculation */
  width?: number;
  /** Intrinsic height of the image for aspect ratio calculation */
  height?: number;
  /** 
   * Sizes attribute for responsive images
   * @example "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
   */
  sizes?: string;
  /** 
   * Whether to lazy load the image (default: true for performance)
   * Set to false for above-the-fold images
   */
  lazy?: boolean;
  /** 
   * Decoding hint for the browser
   * @default "async" for performance
   */
  decoding?: 'async' | 'sync' | 'auto';
  /** 
   * Priority hint for the browser
   * Use "high" for LCP images (above-the-fold)
   */
  fetchPriority?: 'high' | 'low' | 'auto';
  /** Callback when image fails to load */
  onLoadError?: () => void;
  /** Fallback element to render on error */
  fallback?: React.ReactNode;
}

/**
 * OptimizedImage component implementing Google Lighthouse performance recommendations:
 * - Responsive images with proper sizes attribute
 * - Lazy loading for below-fold images
 * - Width/height attributes to prevent CLS
 * - Async decoding for non-blocking rendering
 * - FetchPriority for LCP optimization
 */
export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  sizes,
  lazy = true,
  decoding = 'async',
  fetchPriority,
  onLoadError,
  fallback,
  className,
  style,
  ...rest
}: OptimizedImageProps) {
  const [hasError, setHasError] = useState(false);

  const handleError = useCallback(() => {
    setHasError(true);
    onLoadError?.();
  }, [onLoadError]);

  // Show fallback on error
  if (hasError && fallback) {
    return <>{fallback}</>;
  }

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      loading={lazy ? 'lazy' : 'eager'}
      decoding={decoding}
      fetchPriority={fetchPriority}
      onError={handleError}
      className={className}
      style={{
        ...style,
        // Ensure images maintain aspect ratio and don't cause layout shifts
        aspectRatio: width && height ? `${width} / ${height}` : undefined,
      }}
      {...rest}
    />
  );
}
