import { useCallback, useEffect, useRef } from 'react';

export interface ProductCategoryCard3DProps {
  title: string;
  imageSrc: string;
  href?: string;
  subtitle?: string;
  alt?: string;
  className?: string;
  fallbackSrc?: string;
}

/**
 * Lightweight 3D category card:
 * - CSS transforms for tilt and parallax
 * - Pointer handlers with requestAnimationFrame
 * - respects prefers-reduced-motion
 * - touch fallback: subtle scale only
 */
export default function ProductCategoryCard3D({
  title,
  subtitle,
  imageSrc,
  href = '#',
  alt = '',
  className = '',
  fallbackSrc,
}: ProductCategoryCard3DProps) {
  const cardRef = useRef<HTMLAnchorElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const shineRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  // Reduced motion preference: disable tilt if user requests reduced motion
  const prefersReducedMotion =
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

  // update transforms with rAF to avoid jank
  const setTransforms = useCallback(
    (rx: number, ry: number, tz: number, shineX = 50, shineY = 50) => {
      if (!innerRef.current || !imgRef.current || !shineRef.current) return;
      innerRef.current.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateZ(${tz}px)`;
      imgRef.current.style.transform = `translateZ(${tz * 1.4}px) scale(${1 + tz / 600})`;
      shineRef.current.style.backgroundPosition = `${shineX}% ${shineY}%`;
    },
    []
  );

  const resetTransforms = useCallback(() => {
    if (!innerRef.current || !imgRef.current || !shineRef.current) return;
    innerRef.current.style.transition = 'transform 420ms cubic-bezier(.2,.9,.2,1)';
    imgRef.current.style.transition = 'transform 420ms cubic-bezier(.2,.9,.2,1)';
    shineRef.current.style.transition = 'opacity 280ms';
    innerRef.current.style.transform = '';
    imgRef.current.style.transform = '';
    shineRef.current.style.opacity = '0';
    window.setTimeout(() => {
      if (innerRef.current) innerRef.current.style.transition = '';
      if (imgRef.current) imgRef.current.style.transition = '';
      if (shineRef.current) shineRef.current.style.transition = '';
    }, 450);
  }, []);

  const handlePointerMove = useCallback(
    (ev: PointerEvent) => {
      if (prefersReducedMotion) return;
      const card = cardRef.current;
      const inner = innerRef.current;
      const img = imgRef.current;
      const shine = shineRef.current;
      if (!card || !inner || !img || !shine) return;

      const rect = card.getBoundingClientRect();
      const px = (ev.clientX - rect.left) / rect.width; // 0..1
      const py = (ev.clientY - rect.top) / rect.height; // 0..1

      // Map to rotation (-12..12 deg)
      const ry = (px - 0.5) * -12; // rotateY
      const rx = (py - 0.5) * 12; // rotateX
      const tz = 18; // translateZ for inner
      const shineX = Math.round(px * 100);
      const shineY = Math.round(py * 100);

      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => setTransforms(rx, ry, tz, shineX, shineY));
      // show sheen
      shine.style.opacity = '1';
    },
    [prefersReducedMotion, setTransforms]
  );

  const handlePointerLeave = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    resetTransforms();
  }, [resetTransforms]);

  // Touch fallback — no tilt, just subtle scale on tap
  const handleTouchStart = useCallback(() => {
    if (!innerRef.current || !imgRef.current) return;
    innerRef.current.style.transition = 'transform 220ms';
    imgRef.current.style.transition = 'transform 220ms';
    innerRef.current.style.transform = 'translateZ(8px) scale(1.01)';
    imgRef.current.style.transform = 'translateZ(12px) scale(1.02)';
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!innerRef.current || !imgRef.current) return;
    innerRef.current.style.transform = '';
    imgRef.current.style.transform = '';
    window.setTimeout(() => {
      if (innerRef.current) innerRef.current.style.transition = '';
      if (imgRef.current) imgRef.current.style.transition = '';
    }, 240);
  }, []);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    // pointer events
    card.addEventListener('pointermove', handlePointerMove);
    card.addEventListener('pointerleave', handlePointerLeave);
    card.addEventListener('pointerup', handlePointerLeave);

    // touch
    card.addEventListener('touchstart', handleTouchStart, { passive: true } as AddEventListenerOptions);
    card.addEventListener('touchend', handleTouchEnd);

    return () => {
      card.removeEventListener('pointermove', handlePointerMove);
      card.removeEventListener('pointerleave', handlePointerLeave);
      card.removeEventListener('pointerup', handlePointerLeave);
      card.removeEventListener('touchstart', handleTouchStart);
      card.removeEventListener('touchend', handleTouchEnd);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [handlePointerMove, handlePointerLeave, handleTouchEnd, handleTouchStart]);

  return (
    <a
      ref={cardRef}
      href={href}
      className={`group block w-full max-w-xs mx-auto ${className}`}
      aria-label={title}
      style={{ perspective: '1000px' }}
    >
      <div
        ref={innerRef}
        className="relative rounded-2xl overflow-hidden shadow-md"
        style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
      >
        <img
          ref={imgRef}
          src={imageSrc}
          alt={alt || title}
          className="w-full h-48 object-cover block rounded-2xl pointer-events-none"
          style={{ transform: 'translateZ(0)', transition: 'transform 420ms cubic-bezier(.2,.9,.2,1)', backfaceVisibility: 'hidden' }}
          onError={(e) => {
            const t = e.currentTarget;
            if (fallbackSrc && t.src !== fallbackSrc) {
              t.src = fallbackSrc;
            }
          }}
        />

        {/* sheen overlay */}
        <div
          ref={shineRef}
          aria-hidden
          className="absolute inset-0 pointer-events-none mix-blend-soft-light"
          style={{
            background:
              'radial-gradient(600px 200px at 50% 20%, rgba(255,255,255,0.35), rgba(255,255,255,0.08), rgba(255,255,255,0) 40%)',
            opacity: 0,
            transition: 'opacity 180ms, background-position 90ms',
            backgroundSize: '200% 200%',
            backgroundRepeat: 'no-repeat',
          }}
        />

        {/* gradient layer for a subtle lift on hover */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/6 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-2xl" />

        {/* content area */}
        <div className="absolute left-4 right-4 bottom-4 bg-white/80 backdrop-blur-sm rounded-md px-3 py-2 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
          {subtitle ? <p className="text-xs text-slate-700 mt-0.5">{subtitle}</p> : null}
        </div>
      </div>
    </a>
  );
}
