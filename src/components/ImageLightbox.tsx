import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageLightboxProps {
  images: { src: string; alt: string; caption?: string }[];
  currentIndex: number;
  onClose: () => void;
}

export default function ImageLightbox({ images, currentIndex, onClose }: ImageLightboxProps) {
  const [index, setIndex] = useState(currentIndex);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [index]);

  const goToNext = () => {
    setIndex((prev) => (prev + 1) % images.length);
  };

  const goToPrevious = () => {
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center"
      onClick={handleBackdropClick}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
        aria-label="Close lightbox"
      >
        <X size={32} />
      </button>

      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 text-white hover:text-gray-300 transition-colors z-10"
            aria-label="Previous image"
          >
            <ChevronLeft size={48} />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-4 text-white hover:text-gray-300 transition-colors z-10"
            aria-label="Next image"
          >
            <ChevronRight size={48} />
          </button>
        </>
      )}

      <div className="max-w-7xl max-h-[90vh] px-4">
        <img
          src={images[index].src}
          alt={images[index].alt}
          className="max-w-full max-h-[85vh] object-contain"
          loading="lazy"
        />
        {images[index].caption && (
          <p className="text-white text-center mt-4 text-sm">{images[index].caption}</p>
        )}
      </div>

      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
          {index + 1} / {images.length}
        </div>
      )}
    </div>
  );
}
