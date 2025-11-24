import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductCarouselProps {
  images: {
    src: string;
    alt: string;
  }[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export default function ProductCarousel({ 
  images, 
  autoPlay = true, 
  autoPlayInterval = 4000 
}: ProductCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      goToNext();
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [currentIndex, isAutoPlaying, autoPlayInterval]);

  return (
    <div className="w-full">
      <div
        className="relative w-full bg-white rounded-lg sm:rounded-xl overflow-hidden shadow-lg border border-gray-200"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(autoPlay)}
      >
        {/* Responsive aspect ratio */}
        <div className="relative aspect-square sm:aspect-[4/3] overflow-hidden">
          <div
            className="flex transition-all duration-500 ease-in-out h-full"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {images.map((image, index) => (
              <div key={index} className="min-w-full h-full flex-shrink-0 flex items-center justify-center bg-white p-2 sm:p-4">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>

        {images.length > 1 && (
          <>
            {/* Navigation buttons - accessible tap targets */}
            <button
              onClick={goToPrevious}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110 min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
            </button>

            <button
              onClick={goToNext}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110 min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Next image"
            >
              <ChevronRight size={20} className="sm:w-6 sm:h-6" />
            </button>

            {/* Indicator dots */}
            <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex space-x-1.5 sm:space-x-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 min-w-[8px] ${
                    index === currentIndex
                      ? 'bg-gray-800 w-6 sm:w-8'
                      : 'bg-gray-400 hover:bg-gray-600 w-2'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
