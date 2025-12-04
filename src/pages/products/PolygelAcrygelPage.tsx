import PageTemplate from '../../components/PageTemplate';
import ApplicationCuring from '../../components/ApplicationCuring';
import ProductSEO from '../../components/ProductSEO';

export default function PolygelAcrygelPage() {
  return (
    <PageTemplate
      title="Polygel / AcryGel"
      subtitle="Lightweight, flexible hybrid gels that combine strength and control — fully HEMA-free and TPO-free."
      breadcrumbs={[
        { label: 'Home', path: '/' },
        { label: 'Our Products', path: '/products' },
        { label: 'Polygel / AcryGel' }
      ]}
    >
      {/* Hero Section */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <div className="mb-8 sm:mb-10 md:mb-12 rounded-lg sm:rounded-xl overflow-hidden">
          <img
            src="/img/products/acrygel_category_1.jpg"
            alt="Polygel / AcryGel"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>

        {/* Hero Description */}
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg sm:rounded-xl border border-gray-200 p-6 sm:p-8 md:p-12">
          <p className="text-base sm:text-lg text-gray-600 font-light leading-relaxed">
            A lightweight hybrid formula blending the strength of acrylic with the flexibility of gel. Perfect 
            for sculpting controlled, structured enhancements with no strong odor and easy workability.
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
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Hybrid Technology</h3>
            <p className="text-sm text-gray-600 font-light leading-relaxed">
              Combines the best properties of acrylic and gel systems for superior workability and strength. 
              No strong odor, easy to shape, and cures under LED or UV lamps.
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Lightweight & Flexible</h3>
            <p className="text-sm text-gray-600 font-light leading-relaxed">
              Lightweight formula that's comfortable to wear while maintaining strength. Flexible enough to move 
              naturally with the nail, reducing stress and preventing lifting.
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Multiple Application Methods</h3>
            <p className="text-sm text-gray-600 font-light leading-relaxed">
              Versatile system works with dual forms, nail forms, or brush-on techniques. Allows technicians 
              to use their preferred application method for consistent results.
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Self-Levelling Formula</h3>
            <p className="text-sm text-gray-600 font-light leading-relaxed">
              Self-levelling consistency creates smooth, professional results with minimal filing required. 
              Flash cure allowed for building layers and creating precise structures.
            </p>
          </div>
        </div>
      </div>

      {/* Available Shades */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 sm:mb-8 text-center">
          Available Shades
        </h2>
        <div className="bg-white rounded-lg border border-gray-200 p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Clear</h3>
              <p className="text-sm text-gray-600 font-light">
                Crystal clear formula for natural nail overlays and French manicure applications
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Natural Cover Tones</h3>
              <p className="text-sm text-gray-600 font-light">
                Soft pinks and beiges that mimic natural nail bed color for seamless enhancements
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Builder Shades</h3>
              <p className="text-sm text-gray-600 font-light">
                Opaque shades for full coverage extensions and creative nail art applications
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Application & Curing */}
      <ApplicationCuring type="polygel-acrygel" />

      {/* SEO Content */}
      <ProductSEO category="polygel-acrygel" />
    </PageTemplate>
  );
}
