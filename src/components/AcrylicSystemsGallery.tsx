import { useState, useCallback, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Use Vite's import.meta.glob to dynamically load all images from acrylic systems folder.
 */
const imageModules = import.meta.glob<{ default: string }>(
  '/public/img/products/builder-systems/Acrylic/**/*.jpg',
  { eager: true }
);

/** Build gallery images from the glob results */
function buildGalleryImages(): { src: string; alt: string }[] {
  const images: { src: string; alt: string }[] = [];

  // Process all image modules
  Object.keys(imageModules).forEach((path) => {
    // Skip if not jpg
    if (!path.endsWith('.jpg')) return;

    const filename = path.split('/').pop() || '';
    
    // Skip the category image
    if (filename.toLowerCase().includes('category')) return;

    // Convert the public path to a URL path (remove /public prefix)
    const imageSrc = path.replace('/public', '');

    // Generate a readable alt text from the filename
    const altText = filename
      .replace(/\.jpg$/i, '')
      .replace(/[-_]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    images.push({
      src: imageSrc,
      alt: `Acrylic System - ${altText}`,
    });
  });

  // Sort images by filename for consistent ordering
  images.sort((a, b) => a.src.localeCompare(b.src));

  return images;
}

const GALLERY_IMAGES = buildGalleryImages();

/** Lightweight gallery modal component */
function GalleryModal({
  images,
  onClose,
}: {
  images: { src: string; alt: string }[];
  onClose: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
    },
    [onClose, goToPrevious, goToNext]
  );

  const handleImageError = (index: number) => {
    setImageErrors((prev) => new Set([...prev, index]));
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="gallery-title-acrylic"
      className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 z-10">
        <h2
          id="gallery-title-acrylic"
          className="text-white text-lg sm:text-xl font-semibold"
        >
          Acrylic Systems
        </h2>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-300 transition-colors p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Close gallery"
        >
          <X size={28} aria-hidden="true" />
        </button>
      </div>

      {/* Navigation arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10 bg-black/30 hover:bg-black/50 rounded-full p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Previous image"
          >
            <ChevronLeft size={32} aria-hidden="true" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10 bg-black/30 hover:bg-black/50 rounded-full p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Next image"
          >
            <ChevronRight size={32} aria-hidden="true" />
          </button>
        </>
      )}

      {/* Main image */}
      <div className="flex-1 flex items-center justify-center w-full max-w-5xl px-4 sm:px-16 py-16">
        {imageErrors.has(currentIndex) ? (
          <div className="text-white text-center">
            <p className="text-lg">Image unavailable</p>
            <p className="text-sm text-gray-400 mt-2">{images[currentIndex]?.alt}</p>
          </div>
        ) : (
          <img
            src={images[currentIndex].src}
            alt={images[currentIndex].alt}
            className="max-w-full max-h-[70vh] object-contain"
            loading="lazy"
            onError={() => handleImageError(currentIndex)}
          />
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/60 py-3 px-4 overflow-x-auto">
          <div className="flex gap-2 justify-center min-w-max">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`relative flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded overflow-hidden border-2 transition-all ${
                  index === currentIndex
                    ? 'border-white scale-110'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
                aria-label={`View image ${index + 1}`}
              >
                {imageErrors.has(index) ? (
                  <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                    <span className="text-xs text-gray-400">N/A</span>
                  </div>
                ) : (
                  <img
                    src={image.src}
                    alt=""
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={() => handleImageError(index)}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Image counter */}
      {images.length > 1 && (
        <div className="absolute bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
}

/** Main component: button that opens the gallery modal */
export default function AcrylicSystemsGallery() {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  if (GALLERY_IMAGES.length === 0) {
    return null;
  }

  return (
    <div className="mb-10 sm:mb-12 md:mb-16">
      <div className="text-center mb-6 sm:mb-8">
        <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
          Product Gallery
        </h3>
        <p className="text-base sm:text-lg text-gray-600 font-light max-w-2xl mx-auto px-2 mb-6">
          Browse our complete range of acrylic system products.
        </p>
        <button
          type="button"
          onClick={() => setIsGalleryOpen(true)}
          className="btn-primary px-6 py-3 rounded-lg font-semibold"
        >
          View {GALLERY_IMAGES.length} Product {GALLERY_IMAGES.length === 1 ? 'Image' : 'Images'}
        </button>
      </div>

      {/* Gallery modal */}
      {isGalleryOpen && (
        <GalleryModal
          images={GALLERY_IMAGES}
          onClose={() => setIsGalleryOpen(false)}
        />
      )}
    </div>
  );
}
