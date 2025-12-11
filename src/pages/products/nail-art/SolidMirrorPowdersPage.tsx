import PageTemplate from '../../../components/PageTemplate';
import ProductSEO from '../../../components/ProductSEO';
import ProductGrid from '../../../components/ProductGrid';

/**
 * Use Vite's import.meta.glob to dynamically load solid mirror powder images
 */
const imageModules = import.meta.glob<{ default: string }>(
  '/public/img/products/nail-art/Solid Mirror Powders/*.jpg',
  { eager: true }
);

/** Build gallery images from the glob results */
function buildMirrorPowderImages(): { src: string; alt: string }[] {
  const images: { src: string; alt: string }[] = [];

  Object.keys(imageModules).forEach((path) => {
    // Skip if not jpg
    if (!path.endsWith('.jpg')) return;

    const filename = path.split('/').pop() || '';
    
    // Skip category images and desktop.ini
    if (filename.toLowerCase().includes('category') || filename.toLowerCase().includes('desktop.ini')) return;

    // Convert the public path to a URL path (remove /public prefix)
    const imageSrc = path.replace('/public', '');

    // Generate a readable alt text from the filename
    const altText = filename
      .replace(/\.jpg$/i, '')
      .replace(/[-_]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    images.push({
      src: imageSrc,
      alt: `Solid Mirror Powders - ${altText}`,
    });
  });

  // Sort images by filename for consistent ordering
  images.sort((a, b) => a.src.localeCompare(b.src));

  return images;
}

const MIRROR_POWDER_IMAGES = buildMirrorPowderImages();

export default function SolidMirrorPowdersPage() {
  return (
    <PageTemplate
      title="Solid Mirror Powders"
      subtitle="Ultra-fine chrome and mirror powders for stunning metallic finishes."
      breadcrumbs={[
        { label: 'Home', path: '/' },
        { label: 'Our Products', path: '/products' },
        { label: 'Nail Art', path: '/products/nail-art' },
        { label: 'Solid Mirror Powders' }
      ]}
    >
      {/* Hero Description */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg sm:rounded-xl border border-gray-200 p-6 sm:p-8 md:p-12">
          <p className="text-base sm:text-lg text-gray-600 font-light leading-relaxed">
            Ultra-fine pigment powders that create mirror-like finishes over gel color. Available in 
            chrome, holographic and color-shift varieties for stunning metallic nail art effects.
          </p>
        </div>
      </div>

      {/* Product Gallery */}
      {MIRROR_POWDER_IMAGES.length > 0 && (
        <ProductGrid
          title="Product Gallery"
          description="Browse our complete range of solid mirror powders"
          images={MIRROR_POWDER_IMAGES}
        />
      )}

      {/* Product Information */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 sm:mb-8">
          Chrome & Mirror Effects
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Chrome Powders</h3>
            <p className="text-sm text-gray-600 font-light leading-relaxed mb-3">
              Classic chrome powders that create a true mirror finish on gel nails. Perfect for creating 
              high-impact metallic looks.
            </p>
            <ul className="space-y-2 text-sm text-gray-600 font-light">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>True mirror finish</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Multiple metallic shades</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Long-lasting shine</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Holographic Powders</h3>
            <p className="text-sm text-gray-600 font-light leading-relaxed mb-3">
              Holographic mirror powders that shift and shimmer with multiple colors. Creates stunning 
              rainbow and prismatic effects.
            </p>
            <ul className="space-y-2 text-sm text-gray-600 font-light">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Rainbow holographic effects</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Multi-dimensional shine</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Works over any base color</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Color-Shift Powders</h3>
            <p className="text-sm text-gray-600 font-light leading-relaxed mb-3">
              Advanced color-shifting powders that change appearance from different angles. Creates 
              unique multi-tonal effects.
            </p>
            <ul className="space-y-2 text-sm text-gray-600 font-light">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Multiple color shifts</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Angle-dependent colors</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Unique visual effects</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Application Method</h3>
            <p className="text-sm text-gray-600 font-light leading-relaxed mb-3">
              All mirror powders apply over cured non-wipe top coat using a silicone applicator or 
              eyeshadow applicator for even coverage.
            </p>
            <ul className="space-y-2 text-sm text-gray-600 font-light">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Apply over no-wipe top coat</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Buff gently for even coverage</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Seal with final top coat</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Application Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 sm:p-6 md:p-8 mb-10 sm:mb-12 md:mb-16">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          Professional Application Tips
        </h3>
        <ul className="space-y-2 text-sm text-blue-800 font-light">
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span>Chrome and mirror powders apply over cured non-wipe top coat</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span>Use a silicone applicator or eyeshadow applicator for best results</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span>Buff the powder gently until you achieve a smooth, even mirror finish</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span>Seal with a thin layer of non-wipe top coat to protect the finish</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span>Darker base colors create more intense metallic effects</span>
          </li>
        </ul>
      </div>

      {/* SEO Content */}
      <ProductSEO category="nail-art" />
    </PageTemplate>
  );
}
