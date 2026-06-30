import PageTemplate from '../../../components/PageTemplate';
import ApplicationCuring from '../../../components/ApplicationCuring';

const RANGE_IMAGES = [
  { src: '/img/products/builder-systems/3-in-1 Builder gel/Builder Gels/3-in-1-builder-gels-A-UG.jpg', alt: 'A-UG Builder Gel range' },
  { src: '/img/products/builder-systems/3-in-1 Builder gel/Builder Gels/3-in-1-builder-gels-UGI-T.jpg', alt: 'UGI-T Builder Gel range' },
  { src: '/img/products/builder-systems/3-in-1 Builder gel/Builder Gels/3-in-1-builder-gels-UGI-V.jpg', alt: 'UGI-V Builder Gel range' },
  { src: '/img/products/builder-systems/3-in-1 Builder gel/Builder Gels/3-in-1-builder-gels-UGN.jpg', alt: 'UGN Builder Gel range' },
  { src: '/img/products/builder-systems/3-in-1 Builder gel/Glitter 3-in-1 Builder Gels/3-in-1-builder-gels-UGI-RS.jpg', alt: 'UGI-RS Builder Gel range' },
  { src: '/img/products/builder-systems/3-in-1 Builder gel/Glitter 3-in-1 Builder Gels/3-in-1-builder-gels-UGS.jpg', alt: 'UGS Builder Gel range' },
];

export default function ThreeInOneBuilderGelsPage() {
  return (
    <PageTemplate
      title="Builder Gels"
      subtitle="Classic 3-in-1 builder gel in a wide range of natural, nude and colour shades."
      breadcrumbs={[
        { label: 'Home', path: '/' },
        { label: 'Our Products', path: '/products' },
        { label: 'Builder & Structure Gels', path: '/products/builder-and-structure-gels' },
        { label: '3-in-1', path: '/products/builder-and-structure-gels/3-in-1' },
        { label: 'Builder Gels' },
      ]}
    >
      {/* Hero Image */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <div className="mb-8 sm:mb-10 md:mb-12 rounded-lg sm:rounded-xl overflow-hidden">
          <img
            src="/img/products/builder-systems/3-in-1 Builder gel/Builder Gels/3-in-1-builder-gels-UGN.jpg"
            alt="3-in-1 Builder Gels colour range"
            width="1600"
            height="400"
            className="category-hero"
          />
        </div>

        {/* Description */}
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg sm:rounded-xl border border-gray-200 p-6 sm:p-8 md:p-12">
          <p className="text-base sm:text-lg text-gray-600 font-light leading-relaxed mb-4">
            Our classic 3-in-1 Builder Gel is available across multiple colour ranges — from clear and natural nudes
            to vibrant tinted shades. Each range delivers the same HEMA-free, TPO-free formula that builds, shapes
            and finishes in a single product.
          </p>
          <p className="text-base sm:text-lg text-gray-600 font-light leading-relaxed">
            Self-levelling consistency, excellent adhesion and a glossy finish that requires no additional top coat.
            Ideal for overlays, extensions and natural nail reinforcement. Minimum order: 25 pieces per colour.
          </p>
        </div>
      </div>

      {/* Colour Ranges */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 sm:mb-8 text-center">
          Available Ranges
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {RANGE_IMAGES.map((img) => (
            <div key={img.src} className="rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Application & Curing */}
      <ApplicationCuring type="builder-gels" />

      {/* Product Details */}
      <div className="bg-white rounded-lg p-5 sm:p-6 md:p-8 border border-gray-200">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">
          Product Details
        </h2>
        <ul className="space-y-3 text-gray-600 font-light text-sm sm:text-base">
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Multiple colour ranges — natural nudes, clear, vibrant tints and more</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>HEMA-free and TPO-free formulation</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>EU Cosmetics Regulation compliant (EC 1223/2009)</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Minimum order: 25 pieces per colour</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Available in 10ml bottles — bottle colour, brush type and branding configured at checkout</span>
          </li>
        </ul>
      </div>
    </PageTemplate>
  );
}
