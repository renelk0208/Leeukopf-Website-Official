import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import OptimizedImage from './OptimizedImage';
import { RESPONSIVE_SIZES } from '../lib/responsive-sizes';

interface CarouselImage {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}

interface AboutImageCarouselProps {
  images: CarouselImage[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export default function AboutImageCarousel({
  images,
  autoPlay = true,
  autoPlayInterval = 6000
}: AboutImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  }, [images.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      goToPrevious();
    } else if (e.key === 'ArrowRight') {
      goToNext();
    }
  }, [goToPrevious, goToNext]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      goToNext();
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [currentIndex, isAutoPlaying, autoPlayInterval, goToNext]);

  if (images.length === 0) return null;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div
        className="relative w-full bg-gray-50 rounded-xl sm:rounded-2xl overflow-hidden shadow-md border border-gray-200"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(autoPlay)}
        role="region"
        aria-label="About Us Image Carousel"
      >
        {/* Carousel container with consistent 4:3 aspect ratio */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <div
            className="flex transition-all duration-500 ease-in-out h-full"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {images.map((image, index) => (
              <div 
                key={index} 
                className="min-w-full h-full flex-shrink-0"
              >
                <OptimizedImage
                  src={image.src}
                  alt={image.alt}
                  width={image.width || 1280}
                  height={image.height || 960}
                  sizes={RESPONSIVE_SIZES.hero}
                  lazy={index !== 0}
                  fetchPriority={index === 0 ? 'high' : undefined}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation buttons - accessible with aria-labels */}
        <button
          onClick={goToPrevious}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-md transition-all duration-200 min-w-[44px] min-h-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-offset-2"
          aria-label="View previous image"
        >
          <ChevronLeft size={20} aria-hidden="true" />
        </button>

        <button
          onClick={goToNext}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-md transition-all duration-200 min-w-[44px] min-h-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-offset-2"
          aria-label="View next image"
        >
          <ChevronRight size={20} aria-hidden="true" />
        </button>

        {/* Indicator dots */}
        <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex space-x-1.5 sm:space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 min-w-[8px] focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-offset-2 ${
                index === currentIndex
                  ? 'bg-blue-800 w-6 sm:w-8'
                  : 'bg-white/60 hover:bg-white/80 w-2'
              }`}
              aria-label={`Go to image ${index + 1} of ${images.length}`}
              aria-current={index === currentIndex ? 'true' : undefined}
            />
          ))}
        </div>
      </div>

      {/* Caption section */}
      {images[currentIndex]?.caption && (
        <div className="mt-3 sm:mt-4 text-center">
          <p className="text-xs sm:text-sm text-gray-600 font-light">
            {images[currentIndex].caption}
          </p>
        </div>
      )}
    </div>
  );
}
