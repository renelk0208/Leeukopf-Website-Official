import PageTemplate from '../../../../components/PageTemplate';
import ApplicationCuring from '../../../../components/ApplicationCuring';
import ProductGrid from '../../../../components/ProductGrid';

/**
 * Use Vite's import.meta.glob to dynamically load all effects rubber base product images
 */
const imageModules = import.meta.glob<{ default: string }>(
  '/public/img/products/tops-and-bases/rubber-bases/Effects Rubber Base/*.{jpg,JPG,jpeg,JPEG}',
  { eager: true }
);

/** Build gallery images from the glob results */
function buildEffectsRubberBaseImages(): { src: string; alt: string }[] {
  const images: { src: string; alt: string }[] = [];

  Object.keys(imageModules).forEach((path) => {
    if (!path.match(/\.(jpg|jpeg)$/i)) return;

    const filename = path.split('/').pop() || '';
    if (filename.toLowerCase().includes('category')) return;

    const imageSrc = path.replace('/public', '');

    const altText = filename
      .replace(/\.(jpg|jpeg)$/i, '')
      .replace(/[-_]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    images.push({
      src: imageSrc,
      alt: `Effects Rubber Base - ${altText}`,
    });
  });

  images.sort((a, b) => a.src.localeCompare(b.src));

  return images;
}

const EFFECTS_RUBBER_BASE_IMAGES = buildEffectsRubberBaseImages();

export default function EffectsRubberBasePage() {
  return (
    <PageTemplate
      title="Effects Rubber Base"
      subtitle="Flexible, self-levelling rubber bases with eye-catching effect finishes, all HEMA-free and TPO-free."
      breadcrumbs={[
        { label: 'Home', path: '/' },
        { label: 'Our Products', path: '/products' },
        { label: 'Top & Bases', path: '/products/top-and-bases' },
        { label: 'Base Coats', path: '/products/top-and-bases/base-coats' },
        { label: 'Effects Rubber Base' }
      ]}
    >
      <div className="mb-10 sm:mb-12 md:mb-16">
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg sm:rounded-xl border border-gray-200 p-6 sm:p-8 md:p-12">
          <p className="text-base sm:text-lg text-gray-600 font-light leading-relaxed mb-4">
            Effects rubber base coats combine the flexible, self-levelling performance of rubber systems with
            decorative finishes that create instant visual impact.
          </p>
          <p className="text-base sm:text-lg text-gray-600 font-light leading-relaxed">
            These HEMA-free and TPO-free formulas help reinforce natural nails while providing effect-driven looks
            ideal for expressive salon services.
          </p>
        </div>
      </div>

      {EFFECTS_RUBBER_BASE_IMAGES.length > 0 && (
        <ProductGrid
          title="Product Gallery"
          description="Browse our complete range of effects rubber base products"
          images={EFFECTS_RUBBER_BASE_IMAGES}
        />
      )}

      <ApplicationCuring type="base-coats" />

      <div className="bg-white rounded-lg p-5 sm:p-6 md:p-8 border border-gray-200">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">
          Key Benefits
        </h2>
        <ul className="space-y-3 text-gray-600 font-light text-sm sm:text-base">
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Flexible formula that adapts naturally to nail movement</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Effect-rich finishes for elevated service menus</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Self-levelling texture for smooth, even application</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>HEMA-free and TPO-free formulation</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Suitable for overlays, reinforcement and creative base looks</span>
          </li>
        </ul>
      </div>
    </PageTemplate>
  );
}
