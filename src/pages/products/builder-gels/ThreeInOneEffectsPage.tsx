import { Link } from 'react-router-dom';
import PageTemplate from '../../../components/PageTemplate';
import ApplicationCuring from '../../../components/ApplicationCuring';

const COLLECTIONS = [
  {
    title: 'Shimmer Glitter Builder Gel',
    path: '/products/builder-and-structure-gels/shimmer-glitter-builder-gel',
    image: '/img/products/builder-systems/3-in-1 Builder gel/Glitter 3-in-1 Builder Gels/shimmer-builder-gels.jpg',
    description: 'Builder gel with multi-dimensional shimmer and glitter particles — structure and sparkle in one formula. 36 shades.',
  },
];

export default function ThreeInOneEffectsPage() {
  return (
    <PageTemplate
      title="Effects Builder Gels"
      subtitle="Builder gels with built-in visual effects — shimmer, glitter and iridescent finishes in a single formula."
      breadcrumbs={[
        { label: 'Home', path: '/' },
        { label: 'Our Products', path: '/products' },
        { label: 'Builder & Structure Gels', path: '/products/builder-and-structure-gels' },
        { label: '3-in-1', path: '/products/builder-and-structure-gels/3-in-1' },
        { label: 'Effects Builder Gels' },
      ]}
    >
      {/* Hero Image */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <div className="mb-8 sm:mb-10 md:mb-12 rounded-lg sm:rounded-xl overflow-hidden">
          <img
            src="/img/products/builder-systems/3-in-1 Builder gel/Glitter 3-in-1 Builder Gels/shimmer-builder-gels.jpg"
            alt="Effects Builder Gels"
            width="1600"
            height="400"
            className="category-hero"
          />
        </div>

        {/* Description */}
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg sm:rounded-xl border border-gray-200 p-6 sm:p-8 md:p-12">
          <p className="text-base sm:text-lg text-gray-600 font-light leading-relaxed mb-4">
            Our Effects Builder Gels combine the strength and versatility of the classic 3-in-1 system with
            stunning built-in visual effects. Shimmer particles, glitter and iridescent finishes are suspended
            directly in the formula — no separate nail art step required.
          </p>
          <p className="text-base sm:text-lg text-gray-600 font-light leading-relaxed">
            HEMA-free and EU certified. Perfect for clients who want effortless sparkle with long-lasting,
            professional wear. Minimum order: 25 pieces per colour.
          </p>
        </div>
      </div>

      {/* Collections */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 sm:mb-8 text-center">
          Collections
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {COLLECTIONS.map((col) => (
            <Link
              key={col.path}
              to={col.path}
              className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="aspect-[4/3] bg-gray-50 relative overflow-hidden">
                <img
                  src={col.image}
                  alt={col.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                  {col.title}
                </h3>
                <p className="text-sm text-gray-600 font-light leading-relaxed">
                  {col.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Application & Curing */}
      <ApplicationCuring type="builder-gels" />

      {/* Product Details */}
      <div className="bg-white rounded-lg p-5 sm:p-6 md:p-8 border border-gray-200">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">
          Product Details
        </h2>
        <ul className="space-y-3 text-gray-600 font-light text-sm sm:text-base">
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Built-in shimmer and glitter effects — no additional nail art required</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>HEMA-free and TPO-free formulation</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>EU Cosmetics Regulation compliant (EC 1223/2009)</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Minimum order: 25 pieces per colour</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Available in 10ml bottles — bottle colour, brush type and branding configured at checkout</span>
          </li>
        </ul>
      </div>
    </PageTemplate>
  );
}
