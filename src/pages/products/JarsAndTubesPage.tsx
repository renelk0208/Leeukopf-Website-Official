import { useState, useCallback, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import PageTemplate from '../../components/PageTemplate';
import ProductSEO from '../../components/ProductSEO';

/**
 * Use Vite's import.meta.glob to dynamically load all images from jars-and-tubes folder.
 */
const imageModules = import.meta.glob<{ default: string }>(
  '/public/img/products/jars-and-tubes/**/*.{jpg,JPG,jpeg,JPEG,png,PNG}',
  { eager: true }
);

/** Build gallery images from the glob results */
function buildGalleryImages(): { src: string; alt: string }[] {
  const images: { src: string; alt: string }[] = [];

  // Process all image modules
  Object.keys(imageModules).forEach((path) => {
    // Skip if not an image file
    if (!path.match(/\.(jpg|jpeg|png)$/i)) return;

    const filename = path.split('/').pop() || '';
    
    // Skip .gitkeep and category images
    if (filename === '.gitkeep' || filename.toLowerCase().includes('category')) return;

    // Convert the public path to a URL path (remove /public prefix)
    const imageSrc = path.replace('/public', '');

    // Generate a readable alt text from the filename
    const altText = filename
      .replace(/\.(jpg|jpeg|png)$/i, '')
      .replace(/[-_]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    images.push({
      src: imageSrc,
      alt: `Jar or Tube - ${altText}`,
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

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const currentImage = images[currentIndex];
  const hasError = imageErrors.has(currentIndex);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="dialog"
      aria-modal="true"
      aria-label="Image gallery modal"
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
        aria-label="Close gallery"
      >
        <X className="w-8 h-8" />
      </button>

      {/* Previous button */}
      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            goToPrevious();
          }}
          className="absolute left-4 text-white hover:text-gray-300 transition-colors z-10"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-12 h-12" />
        </button>
      )}

      {/* Image */}
      <div className="max-w-7xl max-h-[90vh] relative" onClick={(e) => e.stopPropagation()}>
        {hasError ? (
          <div className="bg-gray-800 text-white p-8 rounded-lg text-center">
            <p className="mb-2">Failed to load image</p>
            <p className="text-sm text-gray-400">{currentImage.alt}</p>
          </div>
        ) : (
          <img
            src={currentImage.src}
            alt={currentImage.alt}
            className="max-w-full max-h-[90vh] object-contain"
            onError={() => handleImageError(currentIndex)}
          />
        )}
        <p className="text-white text-center mt-4 text-sm">
          {currentIndex + 1} / {images.length}
        </p>
      </div>

      {/* Next button */}
      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            goToNext();
          }}
          className="absolute right-4 text-white hover:text-gray-300 transition-colors z-10"
          aria-label="Next image"
        >
          <ChevronRight className="w-12 h-12" />
        </button>
      )}
    </div>
  );
}

/** Main Gallery Component */
function JarsAndTubesGallery() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  const handleImageError = (index: number) => {
    setImageErrors((prev) => new Set([...prev, index]));
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="mb-10 sm:mb-12 md:mb-16">
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 sm:mb-8">
        Acrylic Jars & Tubes Gallery
      </h2>

      {GALLERY_IMAGES.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-600">No images found in this collection.</p>
        </div>
      ) : (
        <>
          {/* Image grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {GALLERY_IMAGES.map((image, index) => {
              const hasError = imageErrors.has(index);
              
              return (
                <div
                  key={index}
                  className="group relative aspect-square bg-gray-50 rounded-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
                  onClick={openModal}
                >
                  {hasError ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                      <span className="text-xs text-gray-500 text-center p-2">
                        Image not available
                      </span>
                    </div>
                  ) : (
                    <img
                      src={image.src}
                      alt={image.alt}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={() => handleImageError(index)}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Modal */}
          {isModalOpen && <GalleryModal images={GALLERY_IMAGES} onClose={closeModal} />}
        </>
      )}
    </div>
  );
}

export default function JarsAndTubesPage() {
  return (
    <PageTemplate
      title="Jars & Tubes"
      subtitle="Premium acrylic jars and tubes in various sizes and styles for professional nail product packaging."
      breadcrumbs={[
        { label: 'Home', path: '/' },
        { label: 'Our Products', path: '/products' },
        { label: 'Jars & Tubes' }
      ]}
    >
      {/* Hero Description */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg sm:rounded-xl border border-gray-200 p-6 sm:p-8 md:p-12">
          <p className="text-base sm:text-lg text-gray-600 font-light leading-relaxed">
            High-quality acrylic jars and tubes designed for professional nail product packaging. 
            Available in various sizes, colors, and styles to perfectly complement your brand identity.
          </p>
        </div>
      </div>

      {/* Product Gallery */}
      <JarsAndTubesGallery />

      {/* Product Types */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 sm:mb-8">
          Available Options
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Acrylic Jars</h3>
            <p className="text-sm text-gray-600 font-light leading-relaxed mb-4">
              Crystal clear acrylic jars with secure screw-on lids. Perfect for builder gels, acrygels, 
              and other gel products. Available in multiple sizes from 5ml to 50ml.
            </p>
            <ul className="space-y-2 text-sm text-gray-600 font-light">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Clear, black, white, and colored options</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Various capacity sizes available</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Professional-grade materials</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Hexagonal Jars</h3>
            <p className="text-sm text-gray-600 font-light leading-relaxed mb-4">
              Unique hexagonal design jars that add a premium aesthetic to your product line. 
              Stand out on shelves with distinctive geometric styling.
            </p>
            <ul className="space-y-2 text-sm text-gray-600 font-light">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Eye-catching geometric shape</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Premium appearance</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Multiple color options</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Tubes</h3>
            <p className="text-sm text-gray-600 font-light leading-relaxed mb-4">
              Acrygel and builder gel tubes for easy application and storage. Convenient squeeze 
              tubes in 30g and 60g sizes with secure caps.
            </p>
            <ul className="space-y-2 text-sm text-gray-600 font-light">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>30g and 60g capacity options</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Easy-squeeze design</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Ideal for acrygel and builder gel</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 sm:mb-8">
          Quality Features
        </h2>
        <div className="bg-white rounded-lg border border-gray-200 p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Premium Materials</h3>
              <p className="text-sm text-gray-600 font-light leading-relaxed">
                Made from high-quality acrylic materials that are durable, chemical-resistant, and maintain 
                product integrity. Crystal clear transparency showcases your products beautifully.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Secure Closures</h3>
              <p className="text-sm text-gray-600 font-light leading-relaxed">
                All jars feature secure screw-on lids with tight seals to prevent leakage and maintain 
                product freshness. Professional-grade closures ensure reliable performance.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Custom Branding</h3>
              <p className="text-sm text-gray-600 font-light leading-relaxed">
                Available with custom labeling and branding options. Add your logo, product information, 
                and custom colors to create a cohesive brand identity.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Various Sizes</h3>
              <p className="text-sm text-gray-600 font-light leading-relaxed">
                Multiple capacity options from small 5ml jars for samples to larger 50ml jars for 
                professional salon use. Choose the perfect size for your product line.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Private Label Options */}
      <div className="bg-primary-50 rounded-lg p-5 sm:p-6 md:p-8 border border-primary-200 mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">
          Private Label Packaging
        </h2>
        <p className="text-sm sm:text-base text-gray-600 font-light leading-relaxed mb-4">
          All jars and tubes are available as part of our private label service. We can customize:
        </p>
        <ul className="space-y-2 text-sm sm:text-base text-gray-600 font-light">
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Custom label design and printing</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Logo application and branding</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Jar and lid color selection</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Packaging design and assembly</span>
          </li>
        </ul>
      </div>

      {/* SEO Content */}
      <ProductSEO category="jars-and-tubes" />
    </PageTemplate>
  );
}
