import PageTemplate from '../../../components/PageTemplate';
import ProductGrid from '../../../components/ProductGrid';
import { categoryHero } from '../../../config/imageMap';

/**
 * Use Vite's import.meta.glob to dynamically load all Quick Cure G1 product images
 */
const imageModules = import.meta.glob<{ default: string }>(
  '/public/img/products/Lamps/Quick Cure G1/**/*.{jpg,JPG,jpeg,JPEG}',
  { eager: true }
);

/** Build gallery images from the glob results */
function buildQuickCureImages(): { src: string; alt: string }[] {
  const images: { src: string; alt: string }[] = [];

  Object.keys(imageModules).forEach((path) => {
    // Skip if not an image file
    if (!path.match(/\.(jpg|jpeg)$/i)) return;

    const filename = path.split('/').pop() || '';
    
    // Skip category images
    if (filename.toLowerCase().includes('category')) return;

    // Convert the public path to a URL path (remove /public prefix)
    const imageSrc = path.replace('/public', '');

    // Generate a readable alt text from the filename
    const altText = filename
      .replace(/\.(jpg|jpeg)$/i, '')
      .replace(/[-_]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    images.push({
      src: imageSrc,
      alt: `Quick Cure G1 - ${altText}`,
    });
  });

  // Sort images by filename for consistent ordering
  images.sort((a, b) => a.src.localeCompare(b.src));

  return images;
}

const QUICK_CURE_IMAGES = buildQuickCureImages();

export default function QuickCureG1Page() {
  return (
    <PageTemplate
      title="Quick Cure G1 Handheld LED Lamp"
      subtitle="Portable LED lamp for on-the-go services and detail work."
      breadcrumbs={[
        { label: 'Home', path: '/' },
        { label: 'Our Products', path: '/products' },
        { label: 'UV & LED Lamps', path: '/products/lamps' },
        { label: 'Quick Cure G1' }
      ]}
    >
      {/* Hero Image */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <div className="mb-8 sm:mb-10 md:mb-12 rounded-lg sm:rounded-xl overflow-hidden">
          <img
            src={categoryHero['quick-cure-g1'] || '/img/products/Lamps/Quick Cure G1/g1-quickcure-lamp-category-card-image.jpg'}
            alt="Quick Cure G1 Handheld LED Lamp"
            width="1600"
            height="400"
            className="category-hero"
          />
        </div>

        {/* Description */}
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg sm:rounded-xl border border-gray-200 p-6 sm:p-8 md:p-12">
          <p className="text-base sm:text-lg text-gray-600 font-light leading-relaxed mb-4">
            The Quick Cure G1 is a portable handheld LED lamp designed for professionals who need flexibility and 
            mobility. Perfect for quick repairs, travel services, home visits and detailed nail art work where 
            precision curing is essential.
          </p>
          <p className="text-base sm:text-lg text-gray-600 font-light leading-relaxed">
            Compact and lightweight, yet powerful enough to cure all gel systems effectively. USB rechargeable 
            with long battery life makes it truly portable — no power outlet required during services.
          </p>
        </div>
      </div>

      {/* Product Gallery */}
      {QUICK_CURE_IMAGES.length > 0 && (
        <ProductGrid
          title="Product Gallery"
          description="Browse detailed views of the Quick Cure G1 handheld lamp"
          images={QUICK_CURE_IMAGES}
        />
      )}

      {/* Features */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 sm:mb-8">
          Key Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Truly Portable</h3>
            <p className="text-sm text-gray-600 font-light leading-relaxed">
              Lightweight and compact design fits easily in service kits and travel bags. No power outlet 
              needed — take professional curing anywhere.
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">USB Rechargeable</h3>
            <p className="text-sm text-gray-600 font-light leading-relaxed">
              Convenient USB charging with long battery life. Charge via computer, power bank or any USB 
              adapter for maximum flexibility.
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Perfect for Detail Work</h3>
            <p className="text-sm text-gray-600 font-light leading-relaxed">
              Focused curing beam ideal for nail art details, quick repairs and single-nail fixes. Precise 
              control over curing placement.
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Professional Power</h3>
            <p className="text-sm text-gray-600 font-light leading-relaxed">
              Don't let the small size fool you — delivers reliable curing power for all gel formulations. 
              Full polymerization in compact format.
            </p>
          </div>
        </div>
      </div>

      {/* Use Cases */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 sm:mb-8">
          Ideal Use Cases
        </h2>
        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Mobile Services</h3>
            <p className="text-sm text-gray-600 font-light">
              Perfect for technicians providing services at clients' homes, events or temporary locations. 
              Completely wireless operation eliminates the need for power outlets.
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Quick Repairs</h3>
            <p className="text-sm text-gray-600 font-light">
              Fast fixes for lifted edges, broken tips or damaged nails. Cure single nails without 
              requiring the full salon lamp setup.
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Nail Art Detailing</h3>
            <p className="text-sm text-gray-600 font-light">
              Precise curing of intricate nail art, 3D embellishments and detailed designs. Flash cure 
              small areas without affecting surrounding work.
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Emergency Backup</h3>
            <p className="text-sm text-gray-600 font-light">
              Keep on hand as a backup lamp in case of equipment failure. Ensures services can continue 
              without interruption.
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
            <span>Portable handheld LED lamp design</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>USB rechargeable battery with long runtime</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Lightweight and compact for easy transport</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Focused LED curing beam</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Compatible with all UV/LED gel systems</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Perfect for mobile services, repairs and nail art</span>
          </li>
        </ul>
      </div>
    </PageTemplate>
  );
}
