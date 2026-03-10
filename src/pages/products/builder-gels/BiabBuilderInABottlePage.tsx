import PageTemplate from '../../../components/PageTemplate';
import ApplicationCuring from '../../../components/ApplicationCuring';
import ProductGrid from '../../../components/ProductGrid';

/**
 * Use Vite's import.meta.glob to dynamically load all BIAB product images
 */
const imageModules = import.meta.glob<{ default: string }>(
  '/public/img/products/builder-systems/BIAB builder-in-a-bottle/**/*.{jpg,JPG,jpeg,JPEG}',
  { eager: true }
);

/** Build gallery images from the glob results */
function buildBiabImages(): { src: string; alt: string }[] {
  const images: { src: string; alt: string }[] = [];

  Object.keys(imageModules).forEach((path) => {
    // Skip if not an image file
    if (!path.match(/\.(jpg|jpeg)$/i)) return;

    const filename = path.split('/').pop() || '';
    
    // Skip category card images
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
      alt: `BIAB Builder in a Bottle - ${altText}`,
    });
  });

  // Sort images by filename for consistent ordering
  images.sort((a, b) => a.src.localeCompare(b.src));

  return images;
}

const BIAB_IMAGES = buildBiabImages();

export default function BiabBuilderInABottlePage() {
  return (
    <PageTemplate
      title="BIAB (Builder in a Bottle)"
      subtitle="Convenient brush-on building system for quick overlays and natural nail reinforcement — HEMA-free and TPO-free."
      breadcrumbs={[
        { label: 'Home', path: '/' },
        { label: 'Our Products', path: '/products' },
        { label: 'Builder & Structure Gels', path: '/products/builder-and-structure-gels' },
        { label: 'BIAB (Builder in a Bottle)' }
      ]}
    >
      {/* Hero Image */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <div className="mb-8 sm:mb-10 md:mb-12 rounded-lg sm:rounded-xl overflow-hidden">
          <img
            src="/img/products/builder-systems/BIAB builder-in-a-bottle/brush-on-builder-category-hero-image.webp"
            alt="BIAB Builder in a Bottle"
            width="1600"
            height="400"
            className="category-hero"
          />
        </div>
      </div>

      {/* Hero Description */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg sm:rounded-xl border border-gray-200 p-6 sm:p-8 md:p-12">
          <p className="text-base sm:text-lg text-gray-600 font-light leading-relaxed mb-4">
            Our BIAB (Builder in a Bottle) system provides the strength and coverage of a builder gel in an 
            easy-to-apply bottle format. Perfect for natural nail overlays, quick reinforcements and services 
            where speed meets professional results.
          </p>
          <p className="text-base sm:text-lg text-gray-600 font-light leading-relaxed">
            Formulated without HEMA or TPO, this self-levelling builder gel flows smoothly from the bottle and 
            provides excellent adhesion, strength and a natural-looking finish. Ideal for busy salons that want 
            efficiency without sacrificing quality.
          </p>
        </div>
      </div>

      {/* Product Gallery */}
      {BIAB_IMAGES.length > 0 && (
        <ProductGrid
          title="Product Gallery"
          description="Browse our complete range of BIAB (Builder in a Bottle) products"
          images={BIAB_IMAGES}
        />
      )}

      {/* Application & Curing */}
      <ApplicationCuring type="builder-gels" />

      {/* Benefits */}
      <div className="bg-white rounded-lg p-5 sm:p-6 md:p-8 border border-gray-200">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">
          Key Benefits
        </h2>
        <ul className="space-y-3 text-gray-600 font-light text-sm sm:text-base">
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Convenient bottle application for fast services</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Self-levelling formula for smooth, professional results</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Excellent strength for natural nail overlays</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>HEMA-free and TPO-free formulation</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Multiple shades including clear and natural cover tones</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Can be used alone or under gel polish</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Perfect for BIAB manicures - a popular natural nail overlay technique</span>
          </li>
        </ul>
      </div>
    </PageTemplate>
  );
}
