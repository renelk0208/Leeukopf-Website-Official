import PageTemplate from '../components/PageTemplate';
import OptimizedImage from '../components/OptimizedImage';
import { RESPONSIVE_SIZES } from '../lib/responsive-sizes';

export default function DistributorsWantedPage() {
  return (
    <PageTemplate
      title="Distributors Wanted"
      subtitle="Join our global network of distributors and bring premium beauty products to your market."
      breadcrumbs={[
        { label: 'Home', path: '/' },
        { label: 'Distributors Wanted' }
      ]}
      showCTA={true}
      ctaText="Apply to Become a Distributor"
    >
      {/* Responsive intro section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 mb-10 sm:mb-12 md:mb-16">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">Partner With Us</h2>
          <p className="text-gray-600 mb-4 font-light leading-relaxed text-sm sm:text-base">
            We are actively seeking distribution partners worldwide to expand our reach and bring our premium gel polish systems, builder gels, and professional nail care products to new markets. Whether you're an established distributor or looking to enter the beauty industry, we offer comprehensive support to help you succeed.
          </p>
          <p className="text-gray-600 font-light leading-relaxed text-sm sm:text-base">
            Our distributor program includes competitive pricing, marketing support, training materials, and access to our full product range. We work closely with partners to ensure mutual growth and success in your territory.
          </p>
        </div>
        <div>
          <OptimizedImage
            src="/World map.png"
            alt="Global distribution network"
            width={1200}
            height={800}
            sizes={RESPONSIVE_SIZES.twoColumn}
            className="w-full h-auto rounded-lg shadow-sm object-cover"
          />
        </div>
      </div>

      {/* Responsive benefits grid */}
      <div className="bg-gray-50 rounded-lg p-4 sm:p-6 md:p-8 border border-gray-200 mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 sm:mb-8 text-center">Benefits of Partnership</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Competitive Margins</h3>
            <p className="text-gray-600 font-light text-xs sm:text-sm">Attractive wholesale pricing with volume discounts and exclusive territory options.</p>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Marketing Support</h3>
            <p className="text-gray-600 font-light text-xs sm:text-sm">Professional marketing materials, product images, and promotional assets included.</p>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Product Training</h3>
            <p className="text-gray-600 font-light text-xs sm:text-sm">Comprehensive training on product features, application techniques, and troubleshooting.</p>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Quality Guarantee</h3>
            <p className="text-gray-600 font-light text-xs sm:text-sm">GMP-certified products with full compliance documentation and quality assurance.</p>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Flexible Orders</h3>
            <p className="text-gray-600 font-light text-xs sm:text-sm">Reasonable minimum order quantities with flexible reorder terms as you grow.</p>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Dedicated Support</h3>
            <p className="text-gray-600 font-light text-xs sm:text-sm">Direct access to our team for questions, support, and partnership development.</p>
          </div>
        </div>
      </div>

      {/* Responsive requirements section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12">
        <div className="order-2 lg:order-1">
          <OptimizedImage
            src="/distribution partnership.png"
            alt="Distribution partnership"
            width={1200}
            height={800}
            sizes={RESPONSIVE_SIZES.twoColumn}
            className="w-full h-auto rounded-lg shadow-sm"
          />
        </div>
        <div className="order-1 lg:order-2">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">Requirements</h2>
          <ul className="space-y-3 text-gray-600 font-light text-sm sm:text-base">
            <li className="flex items-start">
              <span className="text-blue-800 mr-2 flex-shrink-0">•</span>
              <span>Established business in beauty, cosmetics, or professional nail care sector</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-800 mr-2 flex-shrink-0">•</span>
              <span>Existing distribution network or retail presence in your territory</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-800 mr-2 flex-shrink-0">•</span>
              <span>Commitment to representing our brands professionally and ethically</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-800 mr-2 flex-shrink-0">•</span>
              <span>Ability to meet minimum order requirements and maintain stock levels</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-800 mr-2 flex-shrink-0">•</span>
              <span>Willingness to provide market feedback and collaborate on growth strategies</span>
            </li>
          </ul>
        </div>
      </div>
    </PageTemplate>
  );
}
