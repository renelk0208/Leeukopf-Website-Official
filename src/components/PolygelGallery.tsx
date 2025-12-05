import { useState, useCallback, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

/** 
 * Configuration for polygel/acrygel product variants.
 */
const POLYGEL_VARIANTS = [
  { 
    id: 'acrygel', 
    folder: 'PolygelAcrygel Images', 
    title: 'AcryGel / PolyGel',
    description: 'Main PolyGel product range'
  },
  { 
    id: 'liquidPolygel', 
    folder: 'Liquid Polygel', 
    title: 'Liquid PolyGel',
    description: 'Liquid polygel formulation'
  },
];

/**
 * Use Vite's import.meta.glob to dynamically load all images from Acrygel folders.
 */
const imageModules = import.meta.glob<{ default: string }>(
  '/public/img/products/builder-systems/Acrygel/**/*.jpg',
  { eager: true }
);

/** Build variant images from the glob results */
function buildVariantImages(): Record<string, { src: string; alt: string }[]> {
  const variantImages: Record<string, { src: string; alt: string }[]> = {};

  // Initialize empty arrays for each variant
  POLYGEL_VARIANTS.forEach((variant) => {
    variantImages[variant.id] = [];
  });

  // Process all image modules
  Object.keys(imageModules).forEach((path) => {
    // Skip if not jpg
    if (!path.endsWith('.jpg')) return;

    // Skip the category image in the Acrygel folder
    if (path.includes('acrygel_polygel-category_image')) return;

    // Extract the folder name from the path
    const pathParts = path.split('/');
    const acrygelIndex = pathParts.findIndex((part) => part === 'Acrygel');
    if (acrygelIndex === -1 || acrygelIndex + 1 >= pathParts.length) return;

    const folderName = pathParts[acrygelIndex + 1];
    const filename = pathParts[pathParts.length - 1];

    // Find the matching variant
    const variant = POLYGEL_VARIANTS.find((v) => v.folder === folderName);
    if (!variant) return;

    // Convert the public path to a URL path (remove /public prefix)
    const imageSrc = path.replace('/public', '');

    // Generate a readable alt text from the filename
    const altText = filename
      .replace(/\.jpg$/i, '')
      .replace(/[-_]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    variantImages[variant.id].push({
      src: imageSrc,
      alt: `${variant.title} - ${altText}`,
    });
  });

  // Sort images within each variant by filename for consistent ordering
  Object.keys(variantImages).forEach((key) => {
    variantImages[key].sort((a, b) => a.src.localeCompare(b.src));
  });

  return variantImages;
}

const VARIANT_IMAGES = buildVariantImages();

/** Lightweight gallery modal component */
function GalleryModal({
  variantKey,
  variantLabel,
  images,
  onClose,
}: {
  variantKey: string;
  variantLabel: string;
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
      aria-labelledby={`gallery-title-${variantKey}`}
      className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 z-10">
        <h2
          id={`gallery-title-${variantKey}`}
          className="text-white text-lg sm:text-xl font-semibold"
        >
          {variantLabel}
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

/** Main component: displays variant cards that open a gallery modal */
export default function PolygelGallery() {
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);

  const handleVariantClick = (variantId: string) => {
    setSelectedVariant(variantId);
  };

  const handleCloseModal = () => {
    setSelectedVariant(null);
  };

  const selectedVariantData = selectedVariant
    ? POLYGEL_VARIANTS.find((v) => v.id === selectedVariant)
    : null;

  const selectedImages = selectedVariant ? VARIANT_IMAGES[selectedVariant] || [] : [];

  // Filter out variants with no images
  const variantsWithImages = POLYGEL_VARIANTS.filter(
    (variant) => VARIANT_IMAGES[variant.id] && VARIANT_IMAGES[variant.id].length > 0
  );

  if (variantsWithImages.length === 0) {
    return null;
  }

  return (
    <div className="mb-10 sm:mb-12 md:mb-16">
      <div className="text-center mb-6 sm:mb-8">
        <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
          Product Gallery
        </h3>
        <p className="text-base sm:text-lg text-gray-600 font-light max-w-2xl mx-auto px-2">
          Browse our PolyGel and AcryGel product images.
        </p>
      </div>

      {/* Variant cards grid - responsive layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {variantsWithImages.map((variant) => (
          <button
            key={variant.id}
            type="button"
            onClick={() => handleVariantClick(variant.id)}
            aria-label={`Open ${variant.title} collection`}
            className="w-full rounded-xl shadow-md bg-white p-4 text-left hover:shadow-lg transition-all cursor-pointer border border-gray-100"
          >
            <div className="text-lg font-semibold text-gray-800 mb-1">
              {variant.title}
            </div>
            <div className="text-sm text-gray-600 font-light">
              {VARIANT_IMAGES[variant.id].length} {VARIANT_IMAGES[variant.id].length === 1 ? 'image' : 'images'}
            </div>
          </button>
        ))}
      </div>

      {/* Gallery modal */}
      {selectedVariant && selectedVariantData && (
        <GalleryModal
          variantKey={selectedVariant}
          variantLabel={selectedVariantData.title}
          images={selectedImages}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
