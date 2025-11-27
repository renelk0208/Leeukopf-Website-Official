import { useState, useCallback, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

/** Configuration for gel polish categories with their folder paths */
const GEL_POLISH_CATEGORIES = [
  { key: 'GlittersCollection', label: 'Glitters Collection', folder: 'Glitters Collection' },
  { key: 'GreenCollection', label: 'Green Collection', folder: 'Green Collection' },
  { key: 'PastelCollection', label: 'Pastel Collection', folder: 'Pastel Collectin' },
  { key: 'RoseNudeCollection', label: 'Rose Nude Collection', folder: 'Rose Nude Collection' },
  { key: 'SolidColourCollection', label: 'Solid Colour Collection', folder: 'Solid Colour Collection' },
  { key: 'SolidCreamCollection', label: 'Solid Cream Collection', folder: 'Solid Cream Collection' },
  { key: 'TransparentColorGelPolish', label: 'Transparent Color Gel Polish', folder: 'Transparent Color Gel Polish' },
  { key: 'WarmNudesCollection', label: 'Warm Nudes Collection', folder: 'Warm Nudes Collection' },
];

/**
 * Use Vite's import.meta.glob to dynamically load all images from gel polish folders.
 * This pattern allows Vite to discover and bundle the images without hardcoding filenames.
 */
const imageModules = import.meta.glob<{ default: string }>(
  '/public/img/products/gel_polishes/**/*.jpg',
  { eager: true }
);

/** Build category images from the glob results */
function buildCategoryImages(): Record<string, { src: string; alt: string }[]> {
  const categoryImages: Record<string, { src: string; alt: string }[]> = {};

  // Initialize empty arrays for each category
  GEL_POLISH_CATEGORIES.forEach((category) => {
    categoryImages[category.key] = [];
  });

  // Process all image modules
  Object.keys(imageModules).forEach((path) => {
    // Skip desktop.ini and other non-image files
    if (!path.endsWith('.jpg')) return;

    // Extract the folder name from the path
    // Path format: /public/img/products/gel_polishes/FolderName/filename.jpg
    const pathParts = path.split('/');
    const folderIndex = pathParts.findIndex((part) => part === 'gel_polishes');
    if (folderIndex === -1 || folderIndex + 1 >= pathParts.length) return;

    const folderName = pathParts[folderIndex + 1];
    const filename = pathParts[pathParts.length - 1];

    // Find the matching category
    const category = GEL_POLISH_CATEGORIES.find((cat) => cat.folder === folderName);
    if (!category) return;

    // Convert the public path to a URL path (remove /public prefix)
    const imageSrc = path.replace('/public', '');

    // Generate a readable alt text from the filename
    const altText = filename
      .replace(/\.jpg$/i, '')
      .replace(/[-_]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    categoryImages[category.key].push({
      src: imageSrc,
      alt: `${category.label} - ${altText}`,
    });
  });

  // Sort images within each category by filename for consistent ordering
  Object.keys(categoryImages).forEach((key) => {
    categoryImages[key].sort((a, b) => a.src.localeCompare(b.src));
  });

  return categoryImages;
}

const CATEGORY_IMAGES = buildCategoryImages();

/** Lightweight gallery modal component */
function GalleryModal({
  categoryKey,
  categoryLabel,
  images,
  onClose,
}: {
  categoryKey: string;
  categoryLabel: string;
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
      aria-labelledby={`gallery-title-${categoryKey}`}
      className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 z-10">
        <h2
          id={`gallery-title-${categoryKey}`}
          className="text-white text-lg sm:text-xl font-semibold"
        >
          {categoryLabel}
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

      {/* Image counter */}
      {images.length > 1 && (
        <div className="absolute bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
}

/** Main component: displays category cards that open a gallery modal */
export default function GelPolishCategoryGallery() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategoryClick = (categoryKey: string) => {
    setSelectedCategory(categoryKey);
  };

  const handleCloseModal = () => {
    setSelectedCategory(null);
  };

  const selectedCategoryData = selectedCategory
    ? GEL_POLISH_CATEGORIES.find((c) => c.key === selectedCategory)
    : null;

  const selectedImages = selectedCategory ? CATEGORY_IMAGES[selectedCategory] || [] : [];

  return (
    <div className="mb-10 sm:mb-12 md:mb-16">
      <div className="text-center mb-6 sm:mb-8">
        <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
          Explore Our Gel Polish Categories
        </h3>
        <p className="text-base sm:text-lg text-gray-600 font-light max-w-2xl mx-auto px-2">
          Click on any category below to browse our complete range of gel polish products.
        </p>
      </div>

      {/* Category cards grid - responsive layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {GEL_POLISH_CATEGORIES.map((category) => (
          <button
            key={category.key}
            type="button"
            onClick={() => handleCategoryClick(category.key)}
            aria-label={`Open ${category.label} gel polish collection`}
            className="w-full rounded-xl shadow-md bg-white p-4 text-left hover:shadow-lg transition-all cursor-pointer border border-gray-100"
          >
            <div className="text-lg font-semibold text-gray-800">
              {category.label}
            </div>
          </button>
        ))}
      </div>

      {/* Gallery modal */}
      {selectedCategory && selectedCategoryData && (
        <GalleryModal
          categoryKey={selectedCategory}
          categoryLabel={selectedCategoryData.label}
          images={selectedImages}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
