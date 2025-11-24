import { Link } from 'react-router-dom';
import PageTemplate from '../components/PageTemplate';

export default function ProductsPage() {
  const categories = [
    {
      title: 'Gel Polish',
      description: 'Professional gel polish systems including French Collection, Solid Colours, Glitters, and complete Tops, Bases & Primers range.',
      path: '/products/gel-polish',
      image: '/img/products/gel_polish_category_1.jpg'
    },
    {
      title: 'Builder Systems',
      description: 'Advanced builder gels including 3-in-1 systems, fibreglass reinforcement, acrylics, and innovative polygel formulations.',
      path: '/products/builder-systems',
      image: '/img/products/builder_gels_category_2.jpg'
    },
    {
      title: 'Tops, Bases & Primers',
      description: 'Complete foundation and finishing systems including wipe-off and non-wipe tops, superior bases, and professional primers.',
      path: '/products/tops-bases-primers',
      image: '/img/products/tops & bases_category_1.jpg'
    }
  ];

  // Video sources for colour mixing section
  const mixingVideoSources = [
    "/videos/mixing/Mixing (2).MP4",
    "/videos/mixing/Mixing (3).MP4",
    "/videos/mixing/Mixing (4).MP4",
    "/videos/mixing/Mixing (5).MP4",
    "/videos/mixing/Mixing (6).MP4",
    "/videos/mixing/Mixing (23).MOV",
    "/videos/mixing/Mixing (24).MOV",
    "/videos/mixing/Mixing (25).MOV"
  ];

  return (
    <PageTemplate
      title="Our Products"
      subtitle="Professional nail care systems designed for perfection. From gel polish to builder systems, explore our complete range."
      breadcrumbs={[
        { label: 'Home', path: '/' },
        { label: 'Our Products' }
      ]}
      showCTA={true}
      ctaText="Request Product Catalogue"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {categories.map((category) => (
          <Link
            key={category.path}
            to={category.path}
            className="group block p-8 bg-white rounded-lg border border-gray-200 hover:border-blue-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
          >
            <div className="aspect-square bg-gray-100 rounded-lg mb-6 border border-gray-200 group-hover:border-blue-500 transition-colors overflow-hidden flex items-center justify-center">
              {category.image ? (
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover"
                />
              ) : null}
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3 group-hover:text-blue-800 transition-colors">
              {category.title}
            </h3>
            <p className="text-gray-600 font-light leading-relaxed">
              {category.description}
            </p>
            <div className="mt-4 text-blue-800 font-semibold group-hover:text-blue-900">
              Explore Collection →
            </div>
          </Link>
        ))}
      </div>

      <div className="bg-gray-50 rounded-lg p-8 border border-gray-200 mb-16">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Why Our Products Stand Out</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl mb-4">💎</div>
            <h3 className="font-semibold text-gray-900 mb-2">Premium Quality</h3>
            <p className="text-sm text-gray-600 font-light">Formulated with the finest ingredients for exceptional performance and durability.</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="font-semibold text-gray-900 mb-2">Extensive Range</h3>
            <p className="text-sm text-gray-600 font-light">From classic shades to trendy colors, we offer complete product ecosystems.</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="font-semibold text-gray-900 mb-2">Professional Grade</h3>
            <p className="text-sm text-gray-600 font-light">Trusted by nail technicians worldwide for salon-quality results.</p>
          </div>
        </div>
      </div>

      <section className="mixing-videos-section">
        <h2 className="mixing-title">Colour Mixing — Behind the Scenes</h2>
        <p className="mixing-text">
          Highly pigmented professional formulas created under strict EU regulations,
          precision-measured, and hand-finished in our laboratory.
        </p>

        <div className="mixing-grid">
          {mixingVideoSources.map((videoSrc, index) => (
            <video 
              key={index}
              className="mixing-video" 
              autoPlay 
              muted 
              loop 
              playsInline 
              preload="auto"
            >
              <source src={videoSrc} type="video/mp4" />
            </video>
          ))}
        </div>
      </section>
    </PageTemplate>
  );
}
