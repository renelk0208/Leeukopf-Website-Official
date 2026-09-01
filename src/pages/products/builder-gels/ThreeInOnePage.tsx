import { Link } from 'react-router-dom';
import PageTemplate from '../../../components/PageTemplate';
import ApplicationCuring from '../../../components/ApplicationCuring';

const SUBCATEGORIES = [
  {
    title: 'Builder Gels',
    path: '/products/builder-and-structure-gels/3-in-1/builder-gels',
    image: '/img/products/builder-systems/3-in-1 Builder gel/Builder Gels/3-in-1-builder-gels-UGN.jpg',
    description: 'Classic 3-in-1 builder gel in a wide range of natural, nude and colour shades — one formula to build, shape and finish.',
  },
  {
    title: 'Effects Builder Gels',
    path: '/products/builder-and-structure-gels/3-in-1/effects-builder-gels',
    image: '/img/products/builder-systems/3-in-1 Builder gel/Glitter 3-in-1 Builder Gels/shimmer-builder-gels.jpg',
    description: 'Builder gels with built-in visual effects — shimmer, glitter and iridescent finishes in a single formula.',
  },
];

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
            src="/img/products/builder-systems/3-in-1 Builder gel/3-in-1-builder-gel-main-category-image.webp"
            alt="3-in-1 Builder Gels"
            width="1600"
            height="400"
            className="category-hero"
          />
        </div>

        {/* Description */}
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg sm:rounded-xl border border-gray-200 p-6 sm:p-8 md:p-12">
          <p className="text-base sm:text-lg text-gray-600 font-light leading-relaxed mb-4">
            3-in-1 Builder Gel
          </p>
          <p className="text-base sm:text-lg text-gray-600 font-light leading-relaxed mb-4">
            3-in-1 refers to building, shaping and sealing the nail in one system. It is not a base, builder and
            top as easily misunderstood. It is not suitable for attaching nail tips. It is, however, good for using
            with Dual Form Nail Tip and Extensions as well as nail forms.
          </p>
        </div>
      </div>

      {/* Sub-category Cards */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 sm:mb-8 text-center">
          Collections
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SUBCATEGORIES.map((sub) => (
            <Link
              key={sub.path}
              to={sub.path}
              className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="aspect-[4/3] bg-gray-50 relative overflow-hidden">
                <img
                  src={sub.image}
                  alt={sub.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                  {sub.title}
                </h3>
                <p className="text-sm text-gray-600 font-light leading-relaxed">
                  {sub.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Application & Curing */}
      <ApplicationCuring type="builder-gels" />

      {/* System Benefits */}
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
