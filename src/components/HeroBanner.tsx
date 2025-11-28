import { ReactNode } from 'react';

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
        <img
          src={imageSrc}
          alt={alt}
          className="hero-banner__image w-full h-full object-cover"
          fetchPriority="high"
          loading="eager"
          draggable={false}
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
