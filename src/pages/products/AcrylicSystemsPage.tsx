import PageTemplate from '../../components/PageTemplate';
import ApplicationCuring from '../../components/ApplicationCuring';
import ProductSEO from '../../components/ProductSEO';
import AcrylicSystemsGallery from '../../components/AcrylicSystemsGallery';

export default function AcrylicSystemsPage() {
  return (
    <PageTemplate
      title="Acrylic Systems"
      subtitle="High-performance powders and liquids for sculpting strong, precise enhancements — always free from HEMA and TPO."
      breadcrumbs={[
        { label: 'Home', path: '/' },
        { label: 'Our Products', path: '/products' },
        { label: 'Acrylic Systems' }
      ]}
    >
      {/* Hero Description */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg sm:rounded-xl border border-gray-200 p-6 sm:p-8 md:p-12">
          <p className="text-base sm:text-lg text-gray-600 font-light leading-relaxed">
            Our acrylic systems deliver strength, stability and fast-setting performance for sculpted nail enhancements. 
            Developed in Europe for consistent, professional results with excellent color stability and minimal yellowing.
          </p>
        </div>
      </div>

      {/* Product Gallery */}
      <AcrylicSystemsGallery />

      {/* System Types */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 sm:mb-8">
          Available Systems
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Standard-Set System</h3>
            <p className="text-sm text-gray-600 font-light leading-relaxed mb-4">
              Traditional setting time provides extended working period for detailed sculpting and precise application. 
              Ideal for technicians who want maximum control over shaping and structure.
            </p>
            <ul className="space-y-2 text-sm text-gray-600 font-light">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>3–5 minutes working time</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Extended sculpting window</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Precise control for detailed work</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Fast-Set System</h3>
            <p className="text-sm text-gray-600 font-light leading-relaxed mb-4">
              Quick-setting formula for efficient salon services. Perfect for busy salons and experienced 
              technicians who want to maximize productivity without compromising quality.
            </p>
            <ul className="space-y-2 text-sm text-gray-600 font-light">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>2–3 minutes working time</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Faster service times</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Efficient for high-volume salons</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Powder Colors */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 sm:mb-8">
          Acrylic Powder Range
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Clear</h3>
            <p className="text-sm text-gray-600 font-light">
              Crystal clear powder for natural overlays, French tips and custom color mixing
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Cover Pinks</h3>
            <p className="text-sm text-gray-600 font-light">
              Natural pink tones that mimic nail bed color for seamless full-coverage enhancements
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Specialty Shades</h3>
            <p className="text-sm text-gray-600 font-light">
              White, opaque and custom colors for creative applications and nail art
            </p>
          </div>
        </div>
      </div>

      {/* Application & Curing */}
      <ApplicationCuring type="acrylic-systems" />

      {/* Important Note */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-5 sm:p-6 md:p-8 mb-10 sm:mb-12 md:mb-16">
        <h3 className="text-lg font-semibold text-amber-900 mb-3 flex items-center gap-2">
          <span>⚠️</span>
          <span>Important: Acrylic Curing</span>
        </h3>
        <p className="text-sm text-amber-800 font-light">
          Acrylic systems cure by air polymerisation, NOT by UV or LED lamp. Do not place acrylic enhancements 
          under gel lamps. Allow proper air-dry time according to the system type (standard or fast-set) for 
          optimal strength and durability.
        </p>
      </div>

      {/* SEO Content */}
      <ProductSEO category="acrylic-systems" />
    </PageTemplate>
  );
}
