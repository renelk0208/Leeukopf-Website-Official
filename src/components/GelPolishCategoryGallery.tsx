import { useState, useCallback, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { subcategoryImages, categoryHero, getSubcategoryImages } from '../config/imageMap';
import ProductCategoryCard3D from './products/ProductCategoryCard3D';
import ProductCarousel from './ProductCarousel';

/** 
 * Configuration for gel polish categories with their folder paths and English titles.
 * Categories are sorted alphabetically by title for consistent display.
 */
const GEL_POLISH_CATEGORIES = [
  { id: 'autumnWinter2526', key: 'autumn-winter-25-26', folder: 'autumn_winter_25_26', title: 'Autumn Winter 25/26', description: 'Seasonal collection with warm colors and festive effects' },
  { id: 'catEyeCollection', key: 'cat-eye-collection', folder: 'Cat Eye Collection', title: 'Cat Eye Collection', description: 'Magnetic cat eye gel polishes with mesmerizing effects' },
  { id: 'creamCollection', key: 'cream-collection', folder: 'Cream Collection', title: 'Cream Collection', description: 'Creamy, opaque gel polishes with smooth coverage' },
  { id: 'frenchCollection', key: 'french-collection', folder: 'French Collection', title: 'French Collection', description: 'Elegant French manicure gel polishes for classic nail art' },
  { id: 'glittersCollection', key: 'glitters-collection', folder: 'Glitters Collection', title: 'Glitters Collection', description: 'Sparkling glitter gel polishes with stunning effects' },
  { id: 'platinumGelPolish', key: 'platinum-gel-polish', folder: 'Platinum Gel Polish', title: 'Platinum Gel Polish', description: 'Premium platinum flash gel polishes with luxurious shimmer' },
  { id: 'solidColourCollection', key: 'solid-colour-collection', folder: 'Solid Colour Collection', title: 'Solid Colour Collection', description: 'Bold and vibrant pure color gel polishes' },
  { id: 'springSummer26', key: 'spring-summer-26', folder: 'spring-summer-26', title: 'Spring Summer 26', description: 'Fresh seasonal collection featuring bright florals, soft pastels, and bold neons' },
].sort((a, b) => a.title.localeCompare(b.title));

/** Build category images from the imageMap data */
function buildCategoryImages(): Record<string, { src: string; alt: string }[]> {
  const categoryImages: Record<string, { src: string; alt: string }[]> = {};

  // Initialize empty arrays for each category
  GEL_POLISH_CATEGORIES.forEach((category) => {
    categoryImages[category.id] = [];
  });

  // Get images from the subcategoryImages mapping
  GEL_POLISH_CATEGORIES.forEach((category) => {
    const images = subcategoryImages['gel-polish']?.[category.key] || [];
    
    categoryImages[category.id] = images.map((src) => {
      const filename = src.split('/').pop() || '';
      const altText = filename
        .replace(/\.jpg$/i, '')
        .replace(/[-_]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      
      return {
        src,
        alt: `${category.title} - ${altText}`,
      };
    });
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
      className="fixed inset-0 z-[70] bg-black/95 flex flex-col items-center justify-center"
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
export default function GelPolishCategoryGallery({ initialCategory }: { initialCategory?: string }) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory || null);

  // Prepare Spring Summer '26 images for the featured carousel
  const springSummerImages = getSubcategoryImages('gel-polish', 'spring-summer-26').map((src) => {
    const filename = src.split('/').pop() || '';
    const altText = filename
      .replace(/2026_spring_summer_collection_/gi, '')
      .replace(/_/g, ' ')
      .replace(/\.jpg$/i, '')
      .trim();
    return {
      src,
      alt: `Spring Summer 26 gel polish ${altText} collection`
    };
  });

  // Handle URL hash to open specific category
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      const category = GEL_POLISH_CATEGORIES.find(c => c.id === hash || c.key === hash);
      if (category) {
        setSelectedCategory(category.id);
      }
    }
  }, []);

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleCloseModal = () => {
    setSelectedCategory(null);
    // Clear hash when closing modal
    if (window.location.hash) {
      window.history.pushState('', document.title, window.location.pathname + window.location.search);
    }
  };

  const selectedCategoryData = selectedCategory
    ? GEL_POLISH_CATEGORIES.find((c) => c.id === selectedCategory)
    : null;

  const selectedImages = selectedCategory ? CATEGORY_IMAGES[selectedCategory] || [] : [];

  return (
    <div className="mb-10 sm:mb-12 md:mb-16">
      {/* Featured Spring Summer '26 Carousel */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <div className="text-center mb-6 sm:mb-8">
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
            ✨ Spring Summer '26 Collection ✨
          </h3>
          <p className="text-base sm:text-lg text-gray-600 font-light max-w-2xl mx-auto px-2">
            Embrace the vibrant energy of the new season with our fresh Spring Summer collection. 
            Featuring bright florals, soft pastels, and bold neons perfect for warm weather looks.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <ProductCarousel images={springSummerImages} autoPlay={true} autoPlayInterval={4000} />
        </div>

        <div className="text-center mt-6 sm:mt-8">
          <p className="text-xs sm:text-sm text-gray-500 italic">
            Featuring bright colors, pastels, neons, and floral designs
          </p>
        </div>
      </div>

      {/* Category Grid Section */}
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
        {GEL_POLISH_CATEGORIES.map((category) => {
          // Get the category card image from categoryHero, fallback to first subcategory image
          const thumbnail = categoryHero[category.key] || CATEGORY_IMAGES[category.id]?.[0]?.src;
          const imageCount = CATEGORY_IMAGES[category.id]?.length || 0;
          
          return (
            <ProductCategoryCard3D
              key={category.id}
              title={category.title}
              subtitle={`${imageCount} images`}
              imageSrc={thumbnail || ''}
              onClick={() => handleCategoryClick(category.id)}
              alt={category.title}
            />
          );
        })}
      </div>

      {/* Gallery modal */}
      {selectedCategory && selectedCategoryData && (
        <GalleryModal
          categoryKey={selectedCategory}
          categoryLabel={selectedCategoryData.title}
          images={selectedImages}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
