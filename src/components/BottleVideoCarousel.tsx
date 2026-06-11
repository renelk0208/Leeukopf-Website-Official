import { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Video {
  src: string;
  alt: string;
}

export default function BottleVideoCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const videos: Video[] = [
    { src: '/videos/bottles/rotating-bottles (2).MP4', alt: 'Premium bottle presentation' },
    { src: '/videos/bottles/rotating-bottles (3).MP4', alt: 'Professional bottle display' },
    { src: '/videos/bottles/rotating-bottles (4).MP4', alt: 'Elegant bottle rotation' },
    { src: '/videos/bottles/rotating-bottles (5).MP4', alt: 'Quality bottle showcase' },
    { src: '/videos/bottles/rotating-bottles (6).MP4', alt: 'Custom branded bottle' },
    { src: '/videos/bottles/rotating-bottles (7).MP4', alt: 'Professional packaging solution' },
    { src: '/videos/bottles/rotating-bottles (9).MP4', alt: 'Branded bottle presentation' },
    { src: '/videos/bottles/rotating-bottles (10).MP4', alt: 'Rotating bottle display' },
    { src: '/videos/bottles/rotating-bottles (11).MP4', alt: 'Quality packaging showcase' },
    { src: '/videos/bottles/rotating-bottles (12).MP4', alt: 'Professional bottle solution' },
    { src: '/videos/bottles/rotating-bottles (13).MP4', alt: 'Premium bottle display' },
    { src: '/videos/bottles/rotating-bottles (14).MP4', alt: 'Custom bottle presentation' },
  ];

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? videos.length - 1 : prevIndex - 1
    );
  }, [videos.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === videos.length - 1 ? 0 : prevIndex + 1
    );
  }, [videos.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // Auto-play carousel effect
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      goToNext();
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [currentIndex, isAutoPlaying, goToNext]);

  // Play video when it becomes active
  useEffect(() => {
    const currentVideo = videoRefs.current[currentIndex];
    if (currentVideo) {
      currentVideo.play().catch(() => {
        // Silently catch autoplay failures
      });
    }
  }, [currentIndex]);

  return (
    <div className="w-full">
      <div
        className="relative w-full"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        {/* 9:16 vertical aspect ratio for mobile-friendly display */}
        <div className="relative aspect-[9/16] overflow-hidden rounded-lg bg-gray-900">
          <div
            className="flex transition-all duration-500 ease-in-out h-full"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {videos.map((video, index) => (
              <div key={index} className="min-w-full h-full flex-shrink-0">
                <video
                  ref={(el) => (videoRefs.current[index] = el)}
                  autoPlay={index === 0}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-contain"
                  aria-label={video.alt}
                >
                  <source src={video.src} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation buttons - accessible tap targets */}
        <button
          onClick={goToPrevious}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-md transition-all duration-200 min-w-[44px] min-h-[44px] flex items-center justify-center z-10"
          aria-label="Previous video"
        >
          <ChevronLeft size={20} aria-hidden="true" />
        </button>

        <button
          onClick={goToNext}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-md transition-all duration-200 min-w-[44px] min-h-[44px] flex items-center justify-center z-10"
          aria-label="Next video"
        >
          <ChevronRight size={20} aria-hidden="true" />
        </button>

        {/* Indicator dots */}
        <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex space-x-1.5 sm:space-x-2 z-10">
          {videos.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 min-w-[8px] ${
                index === currentIndex
                  ? 'bg-white w-6 sm:w-8'
                  : 'bg-white/60 hover:bg-white/80 w-2'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Caption section */}
      <div className="mt-4 sm:mt-6 text-center">
        <p className="text-sm sm:text-base text-gray-600 font-light">
          Premium bottles available for custom branding
        </p>
      </div>
    </div>
  );
}
