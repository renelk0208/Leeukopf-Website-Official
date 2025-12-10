import PageTemplate from '../../../components/PageTemplate';
import ProductGrid from '../../../components/ProductGrid';

/**
 * Use Vite's import.meta.glob to dynamically load all Comfort Plus L3 product images
 */
const imageModules = import.meta.glob<{ default: string }>(
  '/public/img/products/Consumables/Lamps/Comfort PlusL3/**/*.{jpg,JPG,jpeg,JPEG,png,PNG}',
  { eager: true }
);

/** Build gallery images from the glob results */
function buildComfortPlusImages(): { src: string; alt: string }[] {
  const images: { src: string; alt: string }[] = [];

  Object.keys(imageModules).forEach((path) => {
    // Skip if not an image file
    if (!path.match(/\.(jpg|jpeg|png)$/i)) return;

    const filename = path.split('/').pop() || '';
    
    // Skip category images
    if (filename.toLowerCase().includes('category')) return;

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
      alt: `Comfort Plus L3 - ${altText}`,
    });
  });

  // Sort images by filename for consistent ordering
  images.sort((a, b) => a.src.localeCompare(b.src));

  return images;
}

const COMFORT_PLUS_IMAGES = buildComfortPlusImages();

export default function ComfortPlusL3Page() {
  return (
    <PageTemplate
      title="Comfort Plus L3 LED Lamp"
      subtitle="Professional high-wattage LED lamp for efficient salon services."
      breadcrumbs={[
        { label: 'Home', path: '/' },
        { label: 'Our Products', path: '/products' },
        { label: 'UV & LED Lamps', path: '/products/lamps' },
        { label: 'Comfort Plus L3' }
      ]}
    >
      {/* Hero Image */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <div className="mb-8 sm:mb-10 md:mb-12 rounded-lg sm:rounded-xl overflow-hidden">
          <img
            src="/img/products/Consumables/Lamps/comfort-plusL1-category-image.jpg"
            alt="Comfort Plus L3 LED Lamp"
            width="1600"
            height="400"
            className="category-hero"
          />
        </div>

        {/* Description */}
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg sm:rounded-xl border border-gray-200 p-6 sm:p-8 md:p-12">
          <p className="text-base sm:text-lg text-gray-600 font-light leading-relaxed mb-4">
            The Comfort Plus L3 is engineered for professional salon environments where efficiency and reliability 
            are essential. With high-wattage LED technology, this lamp delivers fast, consistent curing for all gel 
            systems while maintaining a comfortable working environment.
          </p>
          <p className="text-base sm:text-lg text-gray-600 font-light leading-relaxed">
            Its spacious interior accommodates both hands and feet comfortably, making it versatile for complete 
            service offerings. Multiple timer settings and automatic sensor activation streamline workflow and 
            improve service efficiency.
          </p>
        </div>
      </div>

      {/* Product Gallery */}
      {COMFORT_PLUS_IMAGES.length > 0 && (
        <ProductGrid
          title="Product Gallery"
          description="Browse detailed views and specifications of the Comfort Plus L3"
          images={COMFORT_PLUS_IMAGES}
        />
      )}

      {/* Features */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 sm:mb-8">
          Key Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">High-Wattage LEDs</h3>
            <p className="text-sm text-gray-600 font-light leading-relaxed">
              Professional-grade LED array delivers fast, complete curing across the entire nail surface. 
              Consistent power output ensures reliable polymerization.
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Spacious Design</h3>
            <p className="text-sm text-gray-600 font-light leading-relaxed">
              Comfortable interior accommodates hands and feet easily. Allows clients to relax during 
              curing without awkward positioning.
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Smart Timer Settings</h3>
            <p className="text-sm text-gray-600 font-light leading-relaxed">
              Multiple preset timer options (10s, 30s, 60s, 90s) plus continuous mode. Automatic 
              sensor activation for hands-free operation.
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Long LED Life</h3>
            <p className="text-sm text-gray-600 font-light leading-relaxed">
              LEDs rated for 50,000+ hours of use. Minimal maintenance requirements and consistent 
              performance throughout lamp lifespan.
            </p>
          </div>
        </div>
      </div>

      {/* Specifications */}
      <div className="bg-white rounded-lg p-5 sm:p-6 md:p-8 border border-gray-200">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">
          Technical Specifications
        </h2>
        <ul className="space-y-3 text-gray-600 font-light text-sm sm:text-base">
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Professional LED technology for efficient gel curing</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Multiple timer settings: 10s, 30s, 60s, 90s, and continuous mode</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Automatic sensor activation for hands-free operation</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Spacious interior suitable for hands and feet</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Long-lasting LED bulbs (50,000+ hours)</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Compatible with all UV/LED gel systems</span>
          </li>
        </ul>
      </div>
    </PageTemplate>
  );
}
