import { ReactNode } from 'react';
import OptimizedImage from './OptimizedImage';
import { RESPONSIVE_SIZES } from '../lib/responsive-sizes';

interface HeroBannerProps {
  imageSrc: string;
  alt: string;
  children?: ReactNode;
}

/**
 * Reusable hero banner component with 21:9 aspect ratio.
 * Full-width, responsive, with object-fit: cover.
 */
export default function HeroBanner({ imageSrc, alt, children }: HeroBannerProps) {
  return (
    <section className="hero-banner relative w-full">
      <div className="hero-banner__image-wrapper w-full aspect-[21/9]">
        <OptimizedImage
          src={imageSrc}
          alt={alt}
          width={2100}
          height={900}
          sizes={RESPONSIVE_SIZES.fullWidth}
          lazy={false}
          fetchPriority="high"
          className="hero-banner__image w-full h-full object-cover"
        />
      </div>
      {children && (
        <div className="hero-banner__content absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </section>
  );
}
