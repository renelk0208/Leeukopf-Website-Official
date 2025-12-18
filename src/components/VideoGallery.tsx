import { useEffect, useRef } from 'react';

interface Video {
  src: string;
  title: string;
  thumbnail?: string;
}

interface VideoGalleryProps {
  videos: Video[];
  title?: string;
  subtitle?: string;
}

export default function VideoGallery({ videos, title, subtitle }: VideoGalleryProps) {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    // Attempt to autoplay all videos on mount
    // This ensures videos start playing even if browser policies delay autoplay
    videoRefs.current.forEach((video) => {
      if (video) {
        video.play().catch(() => {
          // Silently catch autoplay failures without impacting UX
          // Common scenarios:
          // - Browser autoplay policy requires user interaction first
          // - Video not yet loaded enough to play
          // - User has disabled autoplay in browser settings
          // The native autoplay attribute will retry once conditions are met
        });
      }
    });
  }, []);

  return (
    <div className="mb-10 sm:mb-12 md:mb-16">
      {title && (
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto font-light px-2">
              {subtitle}
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {videos.map((video, index) => (
          <div
            key={index}
            className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
          >
            <video
              ref={(el) => (videoRefs.current[index] = el)}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster={video.thumbnail}
              className="w-full h-full object-cover"
              aria-label={video.title}
            >
              <source src={video.src} type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* Video title overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 sm:p-4">
              <p className="text-white text-xs sm:text-sm font-semibold line-clamp-2">
                {video.title}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
