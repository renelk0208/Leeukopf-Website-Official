import { Link } from 'react-router-dom';
import PageTemplate from '../components/PageTemplate';

export default function PrivateLabelPage() {
  const categories = [
    {
      title: 'Bottles',
      description: 'Custom branded gel polish bottles in various sizes. High-quality packaging with your logo and design.',
      path: '/private-label/bottles'
    },
    {
      title: 'Jars',
      description: 'Premium acrylic and glass jars for builder gels, acrylics, and specialty products with custom branding.',
      path: '/private-label/jars'
    },
    {
      title: 'Bulk Orders',
      description: 'Large volume production with custom formulations. Perfect for established brands scaling operations.',
      path: '/private-label/bulk'
    }
  ];

  return (
    <PageTemplate
      title="Private Label Services"
      subtitle="Create your own brand with our comprehensive private label solutions. From formulation to packaging, we handle everything."
      breadcrumbs={[
        { label: 'Home', path: '/' },
        { label: 'Private Label' }
      ]}
      showCTA={true}
      ctaText="Request a Quote"
    >
      {/* Responsive intro section */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">Our Private Label Solutions</h2>
        <p className="text-gray-600 font-light leading-relaxed mb-6 sm:mb-8 text-sm sm:text-base">
          Launch or expand your beauty brand with confidence. We offer complete private label services including custom formulations, packaging design, regulatory compliance, and quality assurance. Our minimum order quantities are competitive, and we work with brands at every stage of growth.
        </p>
        {/* Responsive category grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {categories.map((category) => (
            <Link
              key={category.path}
              to={category.path}
              className="group block p-4 sm:p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 group-hover:text-blue-800 transition-colors">{category.title}</h3>
              <p className="text-gray-600 font-light group-hover:text-gray-700 text-sm sm:text-base">{category.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Responsive services section */}
      <div className="bg-gray-50 rounded-lg p-4 sm:p-6 md:p-8 border border-gray-200">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">What We Provide</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Custom Formulations</h3>
            <p className="text-gray-600 font-light text-xs sm:text-sm">Work with our chemists to develop unique formulas tailored to your brand vision and market needs.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Packaging Design</h3>
            <p className="text-gray-600 font-light text-xs sm:text-sm">Complete packaging solutions including bottle selection, label design, and custom printing.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Regulatory Support</h3>
            <p className="text-gray-600 font-light text-xs sm:text-sm">Full compliance documentation including SDS, PIF, and certification for EU and international markets.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Quality Assurance</h3>
            <p className="text-gray-600 font-light text-xs sm:text-sm">Every batch tested and certified to meet the highest industry standards before shipping.</p>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
}
