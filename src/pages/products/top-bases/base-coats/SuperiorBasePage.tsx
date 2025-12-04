import PageTemplate from '../../../../components/PageTemplate';
import ApplicationCuring from '../../../../components/ApplicationCuring';

export default function SuperiorBasePage() {
  return (
    <PageTemplate
      title="Superior Base (5-in-1)"
      subtitle="A multifunction base that primes, levels, strengthens and perfects — HEMA-free and TPO-free."
      breadcrumbs={[
        { label: 'Home', path: '/' },
        { label: 'Our Products', path: '/products' },
        { label: 'Top & Bases', path: '/products/top-and-bases' },
        { label: 'Base Coats', path: '/products/top-and-bases/base-coats' },
        { label: 'Superior Base (5-in-1)' }
      ]}
    >
      {/* Hero Description */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg sm:rounded-xl border border-gray-200 p-6 sm:p-8 md:p-12">
          <p className="text-base sm:text-lg text-gray-600 font-light leading-relaxed mb-4">
            Our Superior Base 5-in-1 combines multiple functions into one efficient formula: primer, base coat, 
            strengthener, self-leveller and ridge filler. This advanced system streamlines application while 
            delivering professional results for busy salons.
          </p>
          <p className="text-base sm:text-lg text-gray-600 font-light leading-relaxed">
            Formulated without HEMA or TPO, this multifunction base supports safer salon practices while providing 
            the comprehensive nail preparation and protection professionals need. Perfect for salons looking to 
            optimize efficiency without compromising on quality.
          </p>
        </div>
      </div>

      {/* 5-in-1 Features */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 sm:mb-8">
          5-in-1 System Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-semibold text-sm">
                1
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Primer</h3>
            </div>
            <p className="text-sm text-gray-600 font-light">
              Prepares the nail plate for optimal adhesion without separate acid-free primer
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-semibold text-sm">
                2
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Base Coat</h3>
            </div>
            <p className="text-sm text-gray-600 font-light">
              Creates strong foundation for gel polish or builder gel application
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-semibold text-sm">
                3
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Strengthener</h3>
            </div>
            <p className="text-sm text-gray-600 font-light">
              Reinforces thin or weak natural nails for improved durability
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-semibold text-sm">
                4
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Self-Leveller</h3>
            </div>
            <p className="text-sm text-gray-600 font-light">
              Smooths uneven nail surfaces for flawless color application
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 md:col-span-2">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-semibold text-sm">
                5
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Ridge Filler</h3>
            </div>
            <p className="text-sm text-gray-600 font-light">
              Fills surface ridges and imperfections for a perfectly smooth finish
            </p>
          </div>
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
            <span>All-in-one system reduces service time and product inventory</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Comprehensive nail preparation in single application</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Professional results with simplified workflow</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>HEMA-free and TPO-free multifunction formula</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Ideal for salons prioritizing efficiency</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Compatible with all gel polish and builder systems</span>
          </li>
        </ul>
      </div>
    </PageTemplate>
  );
}
