import PageTemplate from '../../components/PageTemplate';
import ProductSEO from '../../components/ProductSEO';

export default function AccessoriesPage() {
  return (
    <PageTemplate
      title="Accessories"
      subtitle="Essential accessories to complete your professional nail setup."
      breadcrumbs={[
        { label: 'Home', path: '/' },
        { label: 'Our Products', path: '/products' },
        { label: 'Accessories' }
      ]}
    >
      {/* Hero Description */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg sm:rounded-xl border border-gray-200 p-6 sm:p-8 md:p-12">
          <p className="text-base sm:text-lg text-gray-600 font-light leading-relaxed">
            Professional tools and accessories that support efficient, high-quality nail services. Carefully 
            selected for durability, ergonomics and consistent performance.
          </p>
        </div>
      </div>

      {/* Accessory Categories */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 sm:mb-8">
          Essential Accessories
        </h2>
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Application Brushes</h3>
            <p className="text-sm text-gray-600 font-light leading-relaxed mb-3">
              Professional gel application brushes in various sizes and shapes. Designed for smooth, even 
              application of gel polish, builder gels and art products.
            </p>
            <ul className="space-y-2 text-sm text-gray-600 font-light">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Flat, oval and detail brushes</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Synthetic bristles optimized for gel products</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Easy to clean and maintain</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Nail Files & Buffers</h3>
            <p className="text-sm text-gray-600 font-light leading-relaxed mb-3">
              Professional-grade files and buffers in various grits for natural nail preparation, product 
              shaping and finishing.
            </p>
            <ul className="space-y-2 text-sm text-gray-600 font-light">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Multiple grit options for different applications</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Washable and durable construction</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Ergonomic shapes for comfort</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Nail Forms & Tips</h3>
            <p className="text-sm text-gray-600 font-light leading-relaxed mb-3">
              Paper forms and plastic tips for gel and acrylic extensions. Available in various shapes and 
              sizes to fit different nail beds.
            </p>
            <ul className="space-y-2 text-sm text-gray-600 font-light">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Paper forms with measurement guides</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Clear and natural tips in multiple sizes</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Different shapes: square, stiletto, coffin, almond</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Dual Forms</h3>
            <p className="text-sm text-gray-600 font-light leading-relaxed mb-3">
              Reusable plastic dual forms for polygel and acrygel applications. Transparent design allows 
              visual control during shaping and curing.
            </p>
            <ul className="space-y-2 text-sm text-gray-600 font-light">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Multiple sizes for different nail shapes</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Reusable and easy to clean</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Clear construction for visual control</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Nail Art Tools</h3>
            <p className="text-sm text-gray-600 font-light leading-relaxed mb-3">
              Specialty tools for creative nail art — dotting tools, striping brushes, magnets for cat eye 
              effects, and stamping plates.
            </p>
            <ul className="space-y-2 text-sm text-gray-600 font-light">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Dotting tools in various sizes</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Fine detail brushes for art work</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Magnetic wands for cat eye gels</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Prep & Finishing Tools</h3>
            <p className="text-sm text-gray-600 font-light leading-relaxed mb-3">
              Essential tools for nail preparation and finishing — cuticle pushers, nippers, lint-free wipes 
              and application containers.
            </p>
            <ul className="space-y-2 text-sm text-gray-600 font-light">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Professional cuticle tools</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Lint-free cleansing wipes</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Product application containers</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Dappen Dishes & Mixing Supplies</h3>
            <p className="text-sm text-gray-600 font-light leading-relaxed mb-3">
              Glass and ceramic dishes for acrylic monomer, slip solution and art gel mixing. Essential for 
              professional acrylic and polygel applications.
            </p>
            <ul className="space-y-2 text-sm text-gray-600 font-light">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Professional glass dappen dishes</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Easy to clean and sanitize</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Various sizes available</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Private Label Options */}
      <div className="bg-primary-50 rounded-lg p-5 sm:p-6 md:p-8 border border-primary-200 mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">
          Private Label Accessories
        </h2>
        <p className="text-sm sm:text-base text-gray-600 font-light leading-relaxed mb-4">
          Many accessories can be customized with your brand logo and packaging for a complete branded 
          professional range. Contact us to discuss custom branding options for:
        </p>
        <ul className="space-y-2 text-sm sm:text-base text-gray-600 font-light">
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Branded nail files and buffers</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Custom printed packaging for tools</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Logo application on select accessories</span>
          </li>
        </ul>
      </div>

      {/* SEO Content */}
      <ProductSEO category="accessories" />
    </PageTemplate>
  );
}
