import { useState, useCallback, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

/** Configuration for gel polish categories with their folder paths */
const GEL_POLISH_CATEGORIES = [
  { key: 'FH', label: 'FH', path: '/img/products/gel_polishes/FH' },
  { key: 'Glitters', label: 'Glitters', path: '/img/products/gel_polishes/Glitters' },
  { key: 'GRN', label: 'GRN', path: '/img/products/gel_polishes/GRN' },
  { key: 'Pastel', label: 'Pastel', path: '/img/products/gel_polishes/Pastel' },
  { key: 'RSN', label: 'RSN', path: '/img/products/gel_polishes/RSN' },
  { key: 'SolidCream', label: 'Solid Cream', path: '/img/products/gel_polishes/solid cream' },
  { key: 'TransparentColour', label: 'Transparent Colour Gel Polish', path: '/img/products/gel_polishes/Transparent Color Gel Polish' },
  { key: 'WAN', label: 'WAN', path: '/img/products/gel_polishes/WAN' },
  { key: 'YSN', label: 'YSN', path: '/img/products/gel_polishes/YSN' },
];

/** Image configuration for each category - maps to actual files in folder */
const CATEGORY_IMAGES: Record<string, { src: string; alt: string }[]> = {
  FH: Array.from({ length: 19 }, (_, i) => ({
    src: `/img/products/gel_polishes/FH/FH_pure_color_gel_polish_hema_free_${i + 1}.jpg`,
    alt: `FH Pure Color Gel Polish HEMA Free ${i + 1}`,
  })),
  Glitters: [
    { src: '/img/products/gel_polishes/Glitters/DSO.jpg', alt: 'DSO Glitter Gel Polish' },
    { src: '/img/products/gel_polishes/Glitters/DSO_A.jpg', alt: 'DSO A Glitter Gel Polish' },
    { src: '/img/products/gel_polishes/Glitters/DSO_C.jpg', alt: 'DSO C Glitter Gel Polish' },
    { src: '/img/products/gel_polishes/Glitters/DSO_G.jpg', alt: 'DSO G Glitter Gel Polish' },
    { src: '/img/products/gel_polishes/Glitters/DSO_GL.jpg', alt: 'DSO GL Glitter Gel Polish' },
    { src: '/img/products/gel_polishes/Glitters/DSO_GY.jpg', alt: 'DSO GY Glitter Gel Polish' },
    { src: '/img/products/gel_polishes/Glitters/DSO_M.jpg', alt: 'DSO M Glitter Gel Polish' },
    { src: '/img/products/gel_polishes/Glitters/DSO_N.jpg', alt: 'DSO N Glitter Gel Polish' },
    { src: '/img/products/gel_polishes/Glitters/DSO_SF.jpg', alt: 'DSO SF Glitter Gel Polish' },
    { src: '/img/products/gel_polishes/Glitters/DSO_TC.jpg', alt: 'DSO TC Glitter Gel Polish' },
  ],
  GRN: Array.from({ length: 5 }, (_, i) => ({
    src: `/img/products/gel_polishes/GRN/GRN_warm_nude_gel_polish_${i + 1}.jpg`,
    alt: `GRN Warm Nude Gel Polish ${i + 1}`,
  })),
  Pastel: Array.from({ length: 4 }, (_, i) => ({
    src: `/img/products/gel_polishes/Pastel/PAN_pastel_color_gel_polish_${i + 1}.jpg`,
    alt: `PAN Pastel Color Gel Polish ${i + 1}`,
  })),
  RSN: Array.from({ length: 3 }, (_, i) => ({
    src: `/img/products/gel_polishes/RSN/RSN_warm_nude_gel_polish_${i + 1}.jpg`,
    alt: `RSN Warm Nude Gel Polish ${i + 1}`,
  })),
  SolidCream: Array.from({ length: 10 }, (_, i) => ({
    src: `/img/products/gel_polishes/solid cream/solid-cream(${i + 1}).jpg`,
    alt: `Solid Cream Gel Polish ${i + 1}`,
  })),
  TransparentColour: Array.from({ length: 5 }, (_, i) => ({
    src: `/img/products/gel_polishes/Transparent Color Gel Polish/transparent-colourgel-polish (${i + 1}).jpg`,
    alt: `Transparent Colour Gel Polish ${i + 1}`,
  })),
  WAN: Array.from({ length: 5 }, (_, i) => ({
    src: `/img/products/gel_polishes/WAN/WAN_warm_nude_gel_polish_${i + 1}.jpg`,
    alt: `WAN Warm Nude Gel Polish ${i + 1}`,
  })),
  YSN: Array.from({ length: 4 }, (_, i) => ({
    src: `/img/products/gel_polishes/YSN/YSN_warm_nude_gel_polish_${i + 1}.jpg`,
    alt: `YSN Warm Nude Gel Polish ${i + 1}`,
  })),
};

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

      {/* Category cards grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
        {GEL_POLISH_CATEGORIES.map((category) => {
          const firstImage = CATEGORY_IMAGES[category.key]?.[0];
          return (
            <button
              key={category.key}
              onClick={() => handleCategoryClick(category.key)}
              className="group bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg hover:border-blue-500 hover:-translate-y-1 transition-all duration-300 text-left"
              aria-label={`Open ${category.label} gel polish collection`}
            >
              <div className="aspect-square bg-gray-100 overflow-hidden">
                {firstImage && (
                  <img
                    src={firstImage.src}
                    alt={`${category.label} preview`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                )}
              </div>
              <div className="p-3 sm:p-4">
                <h4 className="font-semibold text-gray-900 text-sm sm:text-base group-hover:text-blue-800 transition-colors truncate">
                  {category.label}
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  {CATEGORY_IMAGES[category.key]?.length || 0} shades
                </p>
              </div>
            </button>
          );
        })}
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
