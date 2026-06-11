import PageTemplate from '../../../../components/PageTemplate';
import ApplicationCuring from '../../../../components/ApplicationCuring';
import ProductGrid from '../../../../components/ProductGrid';

/**
 * Use Vite's import.meta.glob to dynamically load all effects top coat product images
 */
const imageModules = import.meta.glob<{ default: string }>(
  '/public/img/products/tops-and-bases/tops/Effects Top Coats/*.{jpg,JPG,jpeg,JPEG,png,PNG}',
  { eager: true }
);

/** Build gallery images from the glob results */
function buildEffectsTopCoatImages(): { src: string; alt: string }[] {
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
      alt: `Effects Top Coat - ${altText}`,
    });
  });

  // Sort images by filename for consistent ordering
  images.sort((a, b) => a.src.localeCompare(b.src));

  return images;
}

const EFFECTS_TOP_COAT_IMAGES = buildEffectsTopCoatImages();

export default function EffectsTopCoatsPage() {
  return (
    <PageTemplate
      title="Effects Top Coats"
      subtitle="Finishes with texture, shimmer or visual accents, formulated without HEMA and TPO."
      breadcrumbs={[
        { label: 'Home', path: '/' },
        { label: 'Our Products', path: '/products' },
        { label: 'Top & Bases', path: '/products/top-and-bases' },
        { label: 'Top Coats', path: '/products/top-and-bases/top-coats' },
        { label: 'Effects' }
      ]}
    >
      {/* Hero Description */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg sm:rounded-xl border border-gray-200 p-6 sm:p-8 md:p-12">
          <p className="text-base sm:text-lg text-gray-600 font-light leading-relaxed mb-4">
            Specialty top coats that add texture, dimension and visual interest to gel services. From matte 
            finishes to shimmer effects, these formulas transform standard gel polish into creative statements 
            while maintaining professional durability.
          </p>
          <p className="text-base sm:text-lg text-gray-600 font-light leading-relaxed">
            All effects top coats are formulated without HEMA or TPO, ensuring cleaner formulations without 
            compromising on creative performance. Compatible with our gel polish and builder systems for 
            unlimited design possibilities.
          </p>
        </div>
      </div>

      {/* Effect Types */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 sm:mb-8">
          Available Effects
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Matte Top Coat</h3>
            <p className="text-sm text-gray-600 font-light leading-relaxed mb-3">
              Velvety matte finish that transforms any gel polish into a sophisticated, modern look. Perfect 
              for editorial and fashion-forward services.
            </p>
            <ul className="space-y-2 text-sm text-gray-600 font-light">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Smooth, even matte finish</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Eliminates all shine</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Durable chip-resistant protection</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Shimmer Effects</h3>
            <p className="text-sm text-gray-600 font-light leading-relaxed mb-3">
              Subtle sparkle and dimension that enhances any colour. Available in various shimmer densities 
              and particle sizes for customized effects.
            </p>
            <ul className="space-y-2 text-sm text-gray-600 font-light">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Adds depth and dimension</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Multiple shimmer options</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Smooth application</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Textured Effects</h3>
            <p className="text-sm text-gray-600 font-light leading-relaxed mb-3">
              Specialty finishes that create unique surface textures — from sugar effects to dimensional patterns.
            </p>
            <ul className="space-y-2 text-sm text-gray-600 font-light">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Unique tactile finishes</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Creates dimensional effects</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Perfect for creative services</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Specialty Finishes</h3>
            <p className="text-sm text-gray-600 font-light leading-relaxed mb-3">
              Additional effect options including colour-shifting, holographic and iridescent finishes for 
              maximum creative flexibility.
            </p>
            <ul className="space-y-2 text-sm text-gray-600 font-light">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Unique visual effects</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Transforms base colours</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Professional durability</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Product Gallery */}
      {EFFECTS_TOP_COAT_IMAGES.length > 0 && (
        <ProductGrid
          title="Product Gallery"
          description="Browse our complete range of effects top coat products"
          images={EFFECTS_TOP_COAT_IMAGES}
        />
      )}

      {/* Application & Curing */}
      <ApplicationCuring type="top-coats" />

      {/* Benefits */}
      <div className="bg-white rounded-lg p-5 sm:p-6 md:p-8 border border-gray-200">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">
          Key Benefits
        </h2>
        <ul className="space-y-3 text-gray-600 font-light text-sm sm:text-base">
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Creative effects without compromising durability</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Easy application over any gel polish colour</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>HEMA-free and TPO-free formulations</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Compatible with our complete product range</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Professional wear time and chip resistance</span>
          </li>
        </ul>
      </div>
    </PageTemplate>
  );
}
