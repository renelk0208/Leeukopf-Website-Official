import PageTemplate from '../../../../components/PageTemplate';
import ApplicationCuring from '../../../../components/ApplicationCuring';
import ProductGrid from '../../../../components/ProductGrid';

/**
 * Use Vite's import.meta.glob to dynamically load all No Heat Spike Builder Gel product images
 */
const imageModules = import.meta.glob<{ default: string }>(
  '/public/img/products/builder-systems/No Heat Spike Builder Gel/**/*.{jpg,JPG,jpeg,JPEG,png,PNG}',
  { eager: true }
);

/** Build gallery images from the glob results */
function buildNoHeatSpikeImages(): { src: string; alt: string }[] {
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
      alt: `No Heat Spike Builder Gel - ${altText}`,
    });
  });

  // Sort images by filename for consistent ordering
  images.sort((a, b) => a.src.localeCompare(b.src));

  return images;
}

const NO_HEAT_SPIKE_IMAGES = buildNoHeatSpikeImages();

export default function NoHeatSpikeBuilderGelPage() {
  return (
    <PageTemplate
      title="No Heat Spike Builder Gel"
      subtitle="Advanced formula that minimizes heat generation during curing — HEMA-free and TPO-free."
      breadcrumbs={[
        { label: 'Home', path: '/' },
        { label: 'Our Products', path: '/products' },
        { label: 'Top & Bases', path: '/products/top-and-bases' },
        { label: 'Base Coats', path: '/products/top-and-bases/base-coats' },
        { label: 'No Heat Spike Builder Gel' }
      ]}
    >
      {/* Hero Description */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg sm:rounded-xl border border-gray-200 p-6 sm:p-8 md:p-12">
          <p className="text-base sm:text-lg text-gray-600 font-light leading-relaxed mb-4">
            Our No Heat Spike Builder Gel is specially formulated to minimize the exothermic reaction during curing, 
            reducing the heat sensation that can cause discomfort for clients with sensitive nail beds.
          </p>
          <p className="text-base sm:text-lg text-gray-600 font-light leading-relaxed">
            This advanced builder gel formula maintains excellent strength and flexibility while providing a more 
            comfortable application experience. HEMA-free and TPO-free, it supports modern salon safety standards 
            and is compatible with our complete gel polish and top coat systems.
          </p>
        </div>
      </div>

      {/* Product Gallery */}
      {NO_HEAT_SPIKE_IMAGES.length > 0 && (
        <div className="mb-10 sm:mb-12 md:mb-16">
          <div className="text-center mb-6 sm:mb-8">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
              Product Gallery
            </h3>
            <p className="text-base sm:text-lg text-gray-600 font-light max-w-2xl mx-auto px-2">
              Browse our complete range of No Heat Spike Builder Gel products
            </p>
          </div>
          <ProductGrid images={NO_HEAT_SPIKE_IMAGES} />
        </div>
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
            <span>Minimized heat generation during curing for enhanced client comfort</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Advanced builder gel formula with excellent strength and flexibility</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Ideal for clients with sensitive nail beds</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>HEMA-free and TPO-free formulation</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Fast LED/UV cure times with reduced exothermic reaction</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Compatible with all gel polish and top coat systems</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Professional-grade performance for overlays and extensions</span>
          </li>
        </ul>
      </div>
    </PageTemplate>
  );
}
