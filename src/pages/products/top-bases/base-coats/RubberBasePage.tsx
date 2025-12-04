import PageTemplate from '../../../../components/PageTemplate';
import ApplicationCuring from '../../../../components/ApplicationCuring';

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
