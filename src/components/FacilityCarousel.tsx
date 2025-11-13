import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function FacilityCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const images = [
    {
      src: '/Leeukopf Factory (2).png',
      alt: 'Leeukopf Laboratories Consultation Team',
      caption: 'Expert Brand Consultation'
    },
    {
      src: '/Leeukopf Factory (3).png',
      alt: 'Leeukopf Laboratories Quality Control Testing',
      caption: 'Precision Quality Control'
    },
    {
      src: '/Leeukopf Factory (4).png',
      alt: 'Leeukopf Laboratories Production Facility',
      caption: 'State-of-the-Art Production'
    },
    {
      src: '/Leeukopf Factory (5).png',
      alt: 'Leeukopf Laboratories Color Development',
      caption: 'Color Innovation Lab'
    },
    {
      src: '/LEEUKOPF factory 2.png',
      alt: 'Leeukopf Laboratories Private Label Products',
      caption: 'Private Label Excellence'
    }
  ];

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
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex, isAutoPlaying]);

  return (
    <div className="w-full">
      <div
        className="relative w-full bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        <div className="relative aspect-video md:aspect-[4/3] sm:aspect-square overflow-hidden">
          <div
            className="flex transition-all duration-500 ease-in-out h-full"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {images.map((image, index) => (
              <div key={index} className="min-w-full h-full flex-shrink-0">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-md transition-all duration-200"
          aria-label="Previous image"
        >
          <ChevronLeft size={20} />
        </button>

        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-md transition-all duration-200"
          aria-label="Next image"
        >
          <ChevronRight size={20} />
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-white w-8'
                  : 'bg-white/60 hover:bg-white/80 w-2'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="mt-8 py-8 md:py-10 px-4 text-center bg-gradient-to-b from-gray-50/50 to-transparent">
        <h3 className="text-2xl md:text-3xl font-light text-gray-900 mb-4 tracking-wide">
          Our Facility — Where Quality Meets Innovation
        </h3>
        <div className="flex justify-center mb-4">
          <div className="w-10 h-1 bg-blue-800 rounded-full"></div>
        </div>
        <p className="text-sm md:text-base text-gray-600 font-light">
          Proudly manufacturing under GMP standards in Europe.
        </p>
      </div>
    </div>
  );
}
