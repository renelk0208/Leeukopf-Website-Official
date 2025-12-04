import PageTemplate from '../../../components/PageTemplate';
import ApplicationCuring from '../../../components/ApplicationCuring';

export default function PremiumFiberGlassPage() {
  return (
    <PageTemplate
      title="Premium Fiber Glass Builder Gels"
      subtitle="Reinforced flexibility and superior strength in a premium formula that stays fully HEMA-free and TPO-free."
      breadcrumbs={[
        { label: 'Home', path: '/' },
        { label: 'Our Products', path: '/products' },
        { label: 'Builder & Structure Gels', path: '/products/builder-and-structure-gels' },
        { label: 'Premium Fiber Glass' }
      ]}
    >
      {/* Hero Image */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <div className="mb-8 sm:mb-10 md:mb-12 rounded-lg sm:rounded-xl overflow-hidden">
          <img
            src="/img/products/Builder Systems/Builder Gels/fibre-glass-builder_gels_category_5.jpg"
            alt="Premium Fiber Glass Builder Gels"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>

        {/* Description */}
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg sm:rounded-xl border border-gray-200 p-6 sm:p-8 md:p-12">
          <p className="text-base sm:text-lg text-gray-600 font-light leading-relaxed mb-4">
            Our premium fibre glass builder gel system incorporates fine glass fibres for enhanced strength 
            and flexibility. Designed for technicians who work with clients needing extra reinforcement or who 
            want to create thin, natural-looking extensions with superior durability.
          </p>
          <p className="text-base sm:text-lg text-gray-600 font-light leading-relaxed">
            The fibre-reinforced formula provides exceptional resistance to lifting, cracking and breakage, while 
            remaining lightweight and flexible enough to move naturally with the nail. Formulated without HEMA 
            or TPO for a cleaner, safer professional application.
          </p>
        </div>
      </div>

      {/* Application & Curing */}
      <ApplicationCuring type="builder-gels" />

      {/* Additional Info */}
      <div className="bg-white rounded-lg p-5 sm:p-6 md:p-8 border border-gray-200">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">
          System Benefits
        </h2>
        <ul className="space-y-3 text-gray-600 font-light text-sm sm:text-base">
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Glass fibre reinforcement for superior strength and flexibility</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Exceptional resistance to lifting, cracking and breakage</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Lightweight formula for thin, natural-looking enhancements</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>HEMA-free and TPO-free premium formulation</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Ideal for overlay reinforcement and thin extensions</span>
          </li>
        </ul>
      </div>
    </PageTemplate>
  );
}
