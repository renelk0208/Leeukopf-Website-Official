import PageTemplate from '../../../components/PageTemplate';
import ApplicationCuring from '../../../components/ApplicationCuring';

export default function ThreeInOnePage() {
  return (
    <PageTemplate
      title="3-in-1 Builder Gels"
      subtitle="One product to build, shape and finish — all safely HEMA-free and TPO-free."
      breadcrumbs={[
        { label: 'Home', path: '/' },
        { label: 'Our Products', path: '/products' },
        { label: 'Builder & Structure Gels', path: '/products/builder-and-structure-gels' },
        { label: '3-in-1' }
      ]}
    >
      {/* Hero Image */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <div className="mb-8 sm:mb-10 md:mb-12 rounded-lg sm:rounded-xl overflow-hidden">
          <img
            src="/img/products/Builder Systems/Builder Gels/3-in-1-builder_gels_category_3.jpg"
            alt="3-in-1 Builder Gels"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>

        {/* Description */}
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg sm:rounded-xl border border-gray-200 p-6 sm:p-8 md:p-12">
          <p className="text-base sm:text-lg text-gray-600 font-light leading-relaxed mb-4">
            Our 3-in-1 builder gel combines base, builder and finish in a single versatile formula. Perfect 
            for technicians who want efficiency without compromising on strength or finish quality. One product, 
            multiple applications — from natural nail overlays to full extensions.
          </p>
          <p className="text-base sm:text-lg text-gray-600 font-light leading-relaxed">
            Formulated without HEMA or TPO, this all-in-one system delivers excellent adhesion, self-levelling 
            consistency and a glossy finish that requires no additional top coat. Ideal for busy salons looking 
            to streamline their service while maintaining professional results.
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
            <span>All-in-one formula simplifies application and reduces service time</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Strong adhesion and flexible strength for natural nail overlays and extensions</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Self-levelling with built-in glossy finish</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>HEMA-free and TPO-free formulation</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Compatible with our gel polish and specialty product ranges</span>
          </li>
        </ul>
      </div>
    </PageTemplate>
  );
}
