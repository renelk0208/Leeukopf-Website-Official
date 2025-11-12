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
      <div className="mb-16">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Our Private Label Solutions</h2>
        <p className="text-gray-600 font-light leading-relaxed mb-8">
          Launch or expand your beauty brand with confidence. We offer complete private label services including custom formulations, packaging design, regulatory compliance, and quality assurance. Our minimum order quantities are competitive, and we work with brands at every stage of growth.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.path}
              to={category.path}
              className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-primary-300 hover:shadow-lg transition-all duration-300"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{category.title}</h3>
              <p className="text-gray-600 font-light">{category.description}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">What We Provide</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Custom Formulations</h3>
            <p className="text-gray-600 font-light text-sm">Work with our chemists to develop unique formulas tailored to your brand vision and market needs.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Packaging Design</h3>
            <p className="text-gray-600 font-light text-sm">Complete packaging solutions including bottle selection, label design, and custom printing.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Regulatory Support</h3>
            <p className="text-gray-600 font-light text-sm">Full compliance documentation including SDS, PIF, and certification for EU and international markets.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Quality Assurance</h3>
            <p className="text-gray-600 font-light text-sm">Every batch tested and certified to meet the highest industry standards before shipping.</p>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
}
