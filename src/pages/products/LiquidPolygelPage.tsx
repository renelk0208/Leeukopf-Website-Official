import PageTemplate from '../../components/PageTemplate';
import ApplicationCuring from '../../components/ApplicationCuring';
import ProductSEO from '../../components/ProductSEO';
import ProductGrid from '../../components/ProductGrid';
import { categoryHero } from '../../config/imageMap';

/**
 * Use Vite's import.meta.glob to dynamically load all liquid polygel product images
 */
const imageModules = import.meta.glob<{ default: string }>(
  '/public/img/products/Liquid Polygel/**/*.{jpg,JPG,jpeg,JPEG,png,PNG}',
  { eager: true }
);

/** Build gallery images from the glob results */
function buildLiquidPolygelImages(): { src: string; alt: string }[] {
  const images: { src: string; alt: string }[] = [];

  Object.keys(imageModules).forEach((path) => {
    // Skip if not an image file
    if (!path.match(/\.(jpg|jpeg|png)$/i)) return;

    // Skip the category image
    if (path.toLowerCase().includes('category')) return;

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
      alt: `Liquid Polygel - ${altText}`,
    });
  });

  // Sort images by filename for consistent ordering
  images.sort((a, b) => a.src.localeCompare(b.src));

  return images;
}

const LIQUID_POLYGEL_IMAGES = buildLiquidPolygelImages();

export default function LiquidPolygelPage() {
  return (
    <PageTemplate
      title="Liquid Polygel"
      subtitle="Revolutionary liquid formula for effortless application and superior control — fully HEMA-free and TPO-free."
      breadcrumbs={[
        { label: 'Home', path: '/' },
        { label: 'Our Products', path: '/products' },
        { label: 'Builder & Structure Gels', path: '/products/builder-and-structure-gels' },
        { label: 'Liquid Polygel' }
      ]}
    >
      {/* Hero Section */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <div className="mb-8 sm:mb-10 md:mb-12 rounded-lg sm:rounded-xl overflow-hidden">
          <img
            src={categoryHero['liquid-polygel']}
            alt="Liquid Polygel"
            width="1600"
            height="400"
            className="category-hero"
          />
        </div>

        {/* Hero Description */}
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg sm:rounded-xl border border-gray-200 p-6 sm:p-8 md:p-12">
          <p className="text-base sm:text-lg text-gray-600 font-light leading-relaxed">
            An innovative liquid polygel formula that flows smoothly for precise application while maintaining 
            the strength and flexibility you need. Perfect for technicians seeking ultimate control with a 
            brush-on technique.
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
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Liquid Formula</h3>
            <p className="text-sm text-gray-600 font-light leading-relaxed">
              Revolutionary liquid consistency makes application smooth and effortless. Flows precisely where 
              you need it while maintaining perfect control for detailed work.
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Superior Control</h3>
            <p className="text-sm text-gray-600 font-light leading-relaxed">
              Advanced formula gives you extended working time to perfect your application. Self-leveling 
              properties ensure a smooth finish with minimal filing required.
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Brush-On Application</h3>
            <p className="text-sm text-gray-600 font-light leading-relaxed">
              Designed for brush application, making it ideal for overlays, extensions, and nail art. 
              Works beautifully with traditional techniques while offering modern performance.
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">HEMA & TPO Free</h3>
            <p className="text-sm text-gray-600 font-light leading-relaxed">
              Formulated without HEMA or TPO for safer application. Reduces sensitivity concerns while 
              delivering professional-grade strength and durability.
            </p>
          </div>
        </div>
      </div>

      {/* Product Gallery */}
      {LIQUID_POLYGEL_IMAGES.length > 0 && (
        <ProductGrid
          title="Product Gallery"
          description="Browse our complete range of liquid polygel products"
          images={LIQUID_POLYGEL_IMAGES}
        />
      )}

      {/* Application Tips */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 sm:mb-8 text-center">
          Application Techniques
        </h2>
        <div className="bg-white rounded-lg border border-gray-200 p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Natural Overlays</h3>
              <p className="text-sm text-gray-600 font-light">
                Apply thin layers to strengthen natural nails while maintaining a lightweight feel
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Extensions</h3>
              <p className="text-sm text-gray-600 font-light">
                Build beautiful extensions with precise control and minimal product waste
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Nail Art Base</h3>
              <p className="text-sm text-gray-600 font-light">
                Create the perfect canvas for intricate nail art designs with a smooth, even surface
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Application & Curing */}
      <ApplicationCuring type="liquid-polygel" />

      {/* SEO Content */}
      <ProductSEO category="liquid-polygel" />
    </PageTemplate>
  );
}
