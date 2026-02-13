import PageTemplate from '../../components/PageTemplate';
import ApplicationCuring from '../../components/ApplicationCuring';
import ProductSEO from '../../components/ProductSEO';
import ProductGrid from '../../components/ProductGrid';
import PolygelCarousel from '../../components/PolygelCarousel';
import { categoryHero } from '../../config/imageMap';

/**
 * Use Vite's import.meta.glob to dynamically load all polygel/acrygel product images
 */
const imageModules = import.meta.glob<{ default: string }>(
  '/public/img/products/{builder-systems/Acrygel-Polygel,Liquid Polygel}/**/*.{jpg,JPG,jpeg,JPEG,png,PNG}',
  { eager: true }
);

/**
 * Load carousel images from the polygel-carousel folder
 */
const carouselImageModules = import.meta.glob<{ default: string }>(
  '/public/img/products/builder-systems/Acrygel-Polygel/polygel-carousel/*.{jpg,JPG,jpeg,JPEG,png,PNG}',
  { eager: true }
);

/** Build gallery images from the glob results */
function buildPolygelImages(): { src: string; alt: string }[] {
  const images: { src: string; alt: string }[] = [];

  Object.keys(imageModules).forEach((path) => {
    // Skip if not an image file
    if (!path.match(/\.(jpg|jpeg|png)$/i)) return;

    // Skip the category image
    if (path.toLowerCase().includes('category')) return;

    // Exclude Liquid Polygel images (only show Acrygel-Polygel)
    if (path.match(/liquid[\s-]*polygel/i)) return;

    const filename = path.split('/').pop() || '';
    
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
      alt: `Polygel / AcryGel - ${altText}`,
    });
  });

  // Sort images by filename for consistent ordering
  images.sort((a, b) => a.src.localeCompare(b.src));

  return images;
}

const POLYGEL_IMAGES = buildPolygelImages();

/** Build carousel images with product names from the polygel-carousel folder */
function buildPolygelCarouselImages(): { src: string; alt: string; name: string }[] {
  const images: { src: string; alt: string; name: string }[] = [];

  Object.keys(carouselImageModules).forEach((path) => {
    // Skip if not an image file
    if (!path.match(/\.(jpg|jpeg|png)$/i)) return;

    const filename = path.split('/').pop() || '';
    
    // Convert the public path to a URL path (remove /public prefix)
    const imageSrc = path.replace('/public', '');

    // Extract product name from filename
    // e.g., "polygel_black_color.jpg" -> "Black"
    // e.g., "polygel_glitters_gold.jpg" -> "Glitters Gold"
    let productName = filename
      .replace(/^polygel_/i, '') // Remove "polygel_" prefix
      .replace(/_color\.(jpg|jpeg|png)$/i, '') // Remove "_color.jpg" suffix
      .replace(/\.(jpg|jpeg|png)$/i, '') // Remove file extension
      .replace(/_/g, ' ') // Replace underscores with spaces
      .trim();

    // Capitalize each word properly
    productName = productName
      .split(' ')
      .map(word => {
        // Special case for "II" suffix
        if (word.toUpperCase() === 'II') return 'II';
        // Capitalize first letter, lowercase the rest
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(' ');

    images.push({
      src: imageSrc,
      alt: `Polygel ${productName}`,
      name: productName,
    });
  });

  // Sort images by name for consistent ordering
  images.sort((a, b) => a.name.localeCompare(b.name));

  return images;
}

const POLYGEL_CAROUSEL_IMAGES = buildPolygelCarouselImages();

export default function PolygelAcrygelPage() {
  return (
    <PageTemplate
      title="Polygel / AcryGel"
      subtitle="Lightweight, flexible hybrid gels that combine strength and control — fully HEMA-free and TPO-free."
      breadcrumbs={[
        { label: 'Home', path: '/' },
        { label: 'Our Products', path: '/products' },
        { label: 'Polygel / AcryGel' }
      ]}
    >
      {/* Hero Section */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <div className="mb-8 sm:mb-10 md:mb-12 rounded-lg sm:rounded-xl overflow-hidden">
          <img
            src={categoryHero['polygel-acrygel']}
            alt="Polygel / AcryGel"
            width="1600"
            height="400"
            className="category-hero"
          />
        </div>

        {/* Hero Description */}
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg sm:rounded-xl border border-gray-200 p-6 sm:p-8 md:p-12">
          <p className="text-base sm:text-lg text-gray-600 font-light leading-relaxed">
            A lightweight hybrid formula blending the strength of acrylic with the flexibility of gel. Perfect 
            for sculpting controlled, structured enhancements with no strong odor and easy workability.
          </p>
        </div>
      </div>

      {/* Product Features */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 sm:mb-8">
          System Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Hybrid Technology</h3>
            <p className="text-sm text-gray-600 font-light leading-relaxed">
              Combines the best properties of acrylic and gel systems for superior workability and strength. 
              No strong odor, easy to shape, and cures under LED or UV lamps.
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Lightweight & Flexible</h3>
            <p className="text-sm text-gray-600 font-light leading-relaxed">
              Lightweight formula that's comfortable to wear while maintaining strength. Flexible enough to move 
              naturally with the nail, reducing stress and preventing lifting.
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Multiple Application Methods</h3>
            <p className="text-sm text-gray-600 font-light leading-relaxed">
              Versatile system works with dual forms, nail forms, or brush-on techniques. Allows technicians 
              to use their preferred application method for consistent results.
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Self-Levelling Formula</h3>
            <p className="text-sm text-gray-600 font-light leading-relaxed">
              Self-levelling consistency creates smooth, professional results with minimal filing required. 
              Flash cure allowed for building layers and creating precise structures.
            </p>
          </div>
        </div>
      </div>

      {/* Product Gallery */}
      {POLYGEL_IMAGES.length > 0 && (
        <ProductGrid
          title="Product Gallery"
          description="Browse our complete range of polygel and acrygel products"
          images={POLYGEL_IMAGES}
        />
      )}

      {/* Available Shades Carousel */}
      {POLYGEL_CAROUSEL_IMAGES.length > 0 && (
        <div className="mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 sm:mb-8 text-center">
            Available Shades
          </h2>
          <div className="mb-8">
            <PolygelCarousel 
              images={POLYGEL_CAROUSEL_IMAGES}
              autoPlay={true}
              autoPlayInterval={5000}
            />
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Clear</h3>
                <p className="text-sm text-gray-600 font-light">
                  Crystal clear formula for natural nail overlays and French manicure applications
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Natural Cover Tones</h3>
                <p className="text-sm text-gray-600 font-light">
                  Soft pinks and beiges that mimic natural nail bed color for seamless enhancements
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Builder Shades</h3>
                <p className="text-sm text-gray-600 font-light">
                  Opaque shades for full coverage extensions and creative nail art applications
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Application & Curing */}
      <ApplicationCuring type="polygel-acrygel" />

      {/* SEO Content */}
      <ProductSEO category="polygel-acrygel" />
    </PageTemplate>
  );
}
