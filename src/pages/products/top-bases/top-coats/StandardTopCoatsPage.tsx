import PageTemplate from '../../../../components/PageTemplate';
import ApplicationCuring from '../../../../components/ApplicationCuring';

export default function StandardTopCoatsPage() {
  return (
    <PageTemplate
      title="Standard Top Coats"
      subtitle="Classic high-shine finishes that seal and protect — fully HEMA-free and TPO-free."
      breadcrumbs={[
        { label: 'Home', path: '/' },
        { label: 'Our Products', path: '/products' },
        { label: 'Top & Bases', path: '/products/top-and-bases' },
        { label: 'Top Coats', path: '/products/top-and-bases/top-coats' },
        { label: 'Standard' }
      ]}
    >
      {/* Hero Description */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg sm:rounded-xl border border-gray-200 p-6 sm:p-8 md:p-12">
          <p className="text-base sm:text-lg text-gray-600 font-light leading-relaxed mb-4">
            Our standard top coats deliver brilliant high-shine finishes with exceptional durability. Available 
            in both wipe-off and non-wipe formulations, these professional-grade top coats seal and protect gel 
            polish colour while enhancing gloss and extending wear time.
          </p>
          <p className="text-base sm:text-lg text-gray-600 font-light leading-relaxed">
            All standard top coats are formulated without HEMA or TPO, supporting safer salon environments while 
            maintaining the professional performance technicians expect. Compatible with our complete gel polish 
            and builder gel systems.
          </p>
        </div>
      </div>

      {/* Product Types */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 sm:mb-8">
          Available Finishes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Non-Wipe Top Coat</h3>
            <p className="text-sm text-gray-600 font-light leading-relaxed mb-3">
              No-cleanse formula with instant high-gloss finish. Perfect for efficient salon services and 
              natural nail polish applications.
            </p>
            <ul className="space-y-2 text-sm text-gray-600 font-light">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>No sticky layer after curing</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Instant brilliant shine</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Faster service times</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Wipe-Off Top Coat</h3>
            <p className="text-sm text-gray-600 font-light leading-relaxed mb-3">
              Professional formula with tacky layer for optimal nail art adhesion and layering. Ideal for 
              detailed creative work and specialty services.
            </p>
            <ul className="space-y-2 text-sm text-gray-600 font-light">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Sticky layer for nail art bonding</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Perfect for layered designs</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Ultra-high gloss finish after cleanse</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

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
            <span>Brilliant high-gloss finish that enhances colour depth</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Chip-resistant protection for extended wear</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>UV/LED curing for fast service times</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>HEMA-free and TPO-free formulation</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Compatible with all gel polish systems</span>
          </li>
        </ul>
      </div>
    </PageTemplate>
  );
}
