import PageTemplate from '../../../components/PageTemplate';
import ApplicationCuring from '../../../components/ApplicationCuring';

export default function ThreePhasePage() {
  return (
    <PageTemplate
      title="3-Phase Builder Gels"
      subtitle="A classic three-step system for controlled strength and precision, made without HEMA or TPO."
      breadcrumbs={[
        { label: 'Home', path: '/' },
        { label: 'Our Products', path: '/products' },
        { label: 'Builder & Structure Gels', path: '/products/builder-and-structure-gels' },
        { label: '3-Phase' }
      ]}
    >
      {/* Hero Image */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <div className="mb-8 sm:mb-10 md:mb-12 rounded-lg sm:rounded-xl overflow-hidden">
          <img
            src="/img/products/Builder Systems/Builder Gels/3-phase-builder_gels_category_4.jpg"
            alt="3-Phase Builder Gels"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>

        {/* Description */}
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg sm:rounded-xl border border-gray-200 p-6 sm:p-8 md:p-12">
          <p className="text-base sm:text-lg text-gray-600 font-light leading-relaxed mb-4">
            The classic three-phase builder gel system separates base, builder and finish into distinct layers, 
            giving technicians precise control over each step of the application process. Ideal for structured 
            overlays, natural nail extensions and detailed sculpting work.
          </p>
          <p className="text-base sm:text-lg text-gray-600 font-light leading-relaxed">
            Our 3-phase system is formulated without HEMA or TPO, offering a cleaner option for salons moving 
            toward safer formulations. Each phase is designed for optimal adhesion, strength and flexibility, 
            with reliable cure times and a smooth, self-levelling finish.
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
            <span>Controlled application with separate base, builder and finish layers</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Excellent adhesion and strength for natural nail overlays and extensions</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Self-levelling formula for smooth, professional results</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>HEMA-free and TPO-free formulation</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Compatible with our gel polish, base and top coat systems</span>
          </li>
        </ul>
      </div>
    </PageTemplate>
  );
}
