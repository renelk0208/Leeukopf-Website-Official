// src/components/SeasonalHeroVideo.tsx

import { getOurProductsVideoSrc } from "../config/seasonal";

type Props = {
  className?: string;
};

export default function SeasonalHeroVideo({ className = "" }: Props) {
  const src = getOurProductsVideoSrc();

  // If no season video is configured, render nothing (safe fallback).
  if (!src) return null;

  return (
    <section className={`w-full ${className}`}>
      {/* Aspect ratio wrapper prevents layout shift */}
      <div className="relative w-full overflow-hidden rounded-2xl bg-black/5 aspect-[16/9] sm:aspect-[21/9]">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={src}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          controls={false}
          disablePictureInPicture
        />
      </div>
    </section>
  );
}
