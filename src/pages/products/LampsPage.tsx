import { Link } from 'react-router-dom';
import PageTemplate from '../../components/PageTemplate';
import ProductSEO from '../../components/ProductSEO';

export default function LampsPage() {
  return (
    <PageTemplate
      title="UV & LED Lamps"
      subtitle="Professional curing lamps for efficient, reliable gel polymerization."
      breadcrumbs={[
        { label: 'Home', path: '/' },
        { label: 'Our Products', path: '/products' },
        { label: 'UV & LED Lamps' }
      ]}
    >
      {/* Hero Description */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg sm:rounded-xl border border-gray-200 p-6 sm:p-8 md:p-12">
          <p className="text-base sm:text-lg text-gray-600 font-light leading-relaxed">
            Professional UV and LED lamps engineered for consistent, efficient gel curing. From portable handheld 
            units to advanced salon models, each lamp is designed for reliable polymerization and long service life.
          </p>
        </div>
      </div>

      {/* Lamp Categories */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 sm:mb-8">
          Available Models
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Comfort Plus L3 */}
          <Link
            to="/products/lamps/comfort-plus-l3"
            className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-primary hover:shadow-lg transition-all"
          >
            <div className="aspect-video bg-gray-100 overflow-hidden">
              <img
                src="/img/products/Lamps/Comfort PlusL3/l3-lamp-category-image.png"
                alt="Comfort Plus L3 LED Lamp"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                Comfort Plus L3
              </h3>
              <p className="text-sm text-gray-600 font-light leading-relaxed mb-4">
                Advanced LED lamp with professional wattage and smart features for efficient salon services. 
                Spacious design accommodates hands and feet comfortably.
              </p>
              <ul className="space-y-2 text-sm text-gray-600 font-light">
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>High wattage for fast curing</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Multiple timer settings</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Comfortable ergonomic design</span>
                </li>
              </ul>
              <div className="mt-4 text-primary font-semibold text-sm group-hover:underline">
                View Details →
              </div>
            </div>
          </Link>

          {/* Quick Cure G1 */}
          <Link
            to="/products/lamps/quick-cure-g1"
            className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-primary hover:shadow-lg transition-all"
          >
            <div className="aspect-video bg-gray-100 overflow-hidden">
              <img
                src="/img/products/Lamps/Quick Cure G1/g1-quickcure-lamp-category-card-image.jpg"
                alt="Quick Cure G1 Handheld Lamp"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                Quick Cure G1
              </h3>
              <p className="text-sm text-gray-600 font-light leading-relaxed mb-4">
                Portable handheld LED lamp perfect for quick fixes, travel services and nail art detail work. 
                Compact yet powerful for on-the-go professionals.
              </p>
              <ul className="space-y-2 text-sm text-gray-600 font-light">
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Portable and lightweight</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>USB rechargeable</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Perfect for repairs and detail work</span>
                </li>
              </ul>
              <div className="mt-4 text-primary font-semibold text-sm group-hover:underline">
                View Details →
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* General Info */}
      <div className="bg-white rounded-lg p-5 sm:p-6 md:p-8 border border-gray-200 mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">
          Why Professional Lamps Matter
        </h2>
        <div className="space-y-4 text-gray-600 font-light text-sm sm:text-base">
          <p>
            A reliable curing lamp is essential for proper gel polymerization. Under-cured gel can lead to premature 
            lifting, service failure and client dissatisfaction. Our professional lamps are engineered to deliver 
            consistent, complete cures across all gel formulations.
          </p>
          <p>
            LED lamps offer energy efficiency, long bulb life and faster cure times compared to traditional UV lamps. 
            They're the industry standard for modern gel nail services, providing cooler curing temperatures and 
            minimal maintenance requirements.
          </p>
        </div>
      </div>

      {/* SEO Content */}
      <ProductSEO category="accessories" />
    </PageTemplate>
  );
}
