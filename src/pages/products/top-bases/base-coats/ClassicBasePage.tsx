import PageTemplate from '../../../../components/PageTemplate';
import ApplicationCuring from '../../../../components/ApplicationCuring';

export default function ClassicBasePage() {
  return (
    <PageTemplate
      title="Classic Base Coats"
      subtitle="A smooth, dependable base for any system — always HEMA-free and TPO-free."
      breadcrumbs={[
        { label: 'Home', path: '/' },
        { label: 'Our Products', path: '/products' },
        { label: 'Top & Bases', path: '/products/top-and-bases' },
        { label: 'Base Coats', path: '/products/top-and-bases/base-coats' },
        { label: 'Classic' }
      ]}
    >
      {/* Hero Description */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg sm:rounded-xl border border-gray-200 p-6 sm:p-8 md:p-12">
          <p className="text-base sm:text-lg text-gray-600 font-light leading-relaxed mb-4">
            Our classic base coat provides a reliable foundation for all gel polish services. Formulated for 
            excellent adhesion to the natural nail plate while creating a smooth, even surface for color application.
          </p>
          <p className="text-base sm:text-lg text-gray-600 font-light leading-relaxed">
            This traditional base coat formula is HEMA-free and TPO-free, supporting modern salon safety standards 
            while delivering the dependable performance professionals expect. Compatible with our complete gel 
            polish, builder gel and top coat systems.
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
            <span>Excellent adhesion to natural nail plate</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Creates smooth, even surface for color application</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Prevents staining of natural nails</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>HEMA-free and TPO-free formulation</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Fast LED/UV cure times</span>
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
