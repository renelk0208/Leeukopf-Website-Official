import PageTemplate from '../../../../components/PageTemplate';
import ApplicationCuring from '../../../../components/ApplicationCuring';
import ProductGrid from '../../../../components/ProductGrid';

/**
 * Use Vite's import.meta.glob to dynamically load all rubber base product images
 */
const imageModules = import.meta.glob<{ default: string }>(
  '/public/img/products/tops-and-bases/rubber-bases/**/*.{jpg,JPG,jpeg,JPEG}',
  { eager: true }
);

/** Build gallery images from the glob results */
function buildRubberBaseImages(): { src: string; alt: string }[] {
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
      alt: `Rubber Base - ${altText}`,
    });
  });

  // Sort images by filename for consistent ordering
  images.sort((a, b) => a.src.localeCompare(b.src));

  return images;
}

const RUBBER_BASE_IMAGES = buildRubberBaseImages();

export default function RubberBasePage() {
  return (
    <PageTemplate
      title="Rubber Base Coats"
      subtitle="Flexible, self-levelling bases ideal for natural nail reinforcement, free from HEMA and TPO."
      breadcrumbs={[
        { label: 'Home', path: '/' },
        { label: 'Our Products', path: '/products' },
        { label: 'Top & Bases', path: '/products/top-and-bases' },
        { label: 'Base Coats', path: '/products/top-and-bases/base-coats' },
        { label: 'Rubber Base' }
      ]}
    >
      {/* Hero Description */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg sm:rounded-xl border border-gray-200 p-6 sm:p-8 md:p-12">
          <p className="text-base sm:text-lg text-gray-600 font-light leading-relaxed mb-4">
            Rubber base coats offer flexible, self-levelling adhesion that moves naturally with the nail. Perfect 
            for natural nail reinforcement, overlay services and clients with thin or flexible nails that benefit 
            from extra support.
          </p>
          <p className="text-base sm:text-lg text-gray-600 font-light leading-relaxed">
            Our rubber base formulas are HEMA-free and TPO-free, providing safer alternatives without sacrificing 
            the strength and flexibility professionals depend on. The self-levelling consistency smooths surface 
            imperfections while creating a strong, flexible foundation.
          </p>
        </div>
      </div>

      {/* Product Gallery */}
      {RUBBER_BASE_IMAGES.length > 0 && (
        <ProductGrid
          title="Product Gallery"
          description="Browse our complete range of rubber base coat products"
          images={RUBBER_BASE_IMAGES}
        />
      )}

      {/* Application & Curing */}
      <ApplicationCuring type="base-coats" />

      {/* Benefits */}
      <div className="bg-white rounded-lg p-5 sm:p-6 md:p-8 border border-gray-200">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">
          Key Benefits
        </h2>
        <ul className="space-y-3 text-gray-600 font-light text-sm sm:text-base">
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Flexible formula that moves naturally with the nail</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Self-levelling consistency smooths surface imperfections</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Ideal for natural nail reinforcement and thin nails</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>HEMA-free and TPO-free formulation</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Strong adhesion with reduced lifting</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Can be used as a standalone overlay or under gel polish</span>
          </li>
        </ul>
      </div>
    </PageTemplate>
  );
}
