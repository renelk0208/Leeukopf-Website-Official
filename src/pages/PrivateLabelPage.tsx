import { Link } from 'react-router-dom';
import PageTemplate from '../components/PageTemplate';
import StartHereBanner from '../components/StartHereBanner';
import { Beaker, Package, PencilRuler, ShieldCheck, ArrowRight } from 'lucide-react';

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

  const services = [
    {
      icon: Beaker,
      title: 'Custom Formulations',
      description: 'Work with our chemists to develop unique formulas tailored to your brand vision and market needs.'
    },
    {
      icon: PencilRuler,
      title: 'Packaging Design',
      description: 'Complete packaging solutions including bottle selection, label design, and custom printing.'
    },
    {
      icon: ShieldCheck,
      title: 'Regulatory Support',
      description: 'Full compliance documentation including SDS, PIF, and certification for EU and international markets.'
    },
    {
      icon: Package,
      title: 'Quality Assurance',
      description: 'Every batch tested and certified to meet the highest industry standards before shipping.'
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
      heroImage="/img/hero/private-label-hero.jpg"
    >
      {/* Start Your Brand Banner */}
      <StartHereBanner />

      {/* Responsive intro section */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6 relative inline-block">
          Our Private Label Solutions
          <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-primary" aria-hidden="true"></span>
        </h2>
        <p className="text-gray-600 font-light leading-relaxed mb-6 sm:mb-8 text-sm sm:text-base">
          Launch or expand your beauty brand with confidence. We offer complete private label services including custom formulations, packaging design, regulatory compliance, and quality assurance. Our minimum order quantities are competitive, and we work with brands at every stage of growth.
        </p>
        {/* Responsive category grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {categories.map((category) => (
            <Link
              key={category.path}
              to={category.path}
              className="card group block p-5 sm:p-6 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer"
            >
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 group-hover:text-primary transition-colors">{category.title}</h3>
              <p className="text-gray-600 font-light group-hover:text-gray-700 text-sm sm:text-base mb-4">{category.description}</p>
              <div className="flex items-center text-secondary font-medium text-sm group-hover:text-secondary-700 transition-colors">
                <span>See our collection</span>
                <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Responsive services section - restyled as feature cards */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 sm:mb-8 text-center">What We Provide</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {services.map((service) => (
            <div
              key={service.title}
              className="card p-5 sm:p-6 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
                  <service.icon size={24} className="text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2 text-base sm:text-lg">{service.title}</h3>
                  <p className="text-gray-600 font-light text-sm sm:text-base leading-relaxed">{service.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageTemplate>
  );
}
