import PageTemplate from '../components/PageTemplate';

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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Partner With Us</h2>
          <p className="text-gray-600 mb-4 font-light leading-relaxed">
            We are actively seeking distribution partners worldwide to expand our reach and bring our premium gel polish systems, builder gels, and professional nail care products to new markets. Whether you're an established distributor or looking to enter the beauty industry, we offer comprehensive support to help you succeed.
          </p>
          <p className="text-gray-600 font-light leading-relaxed">
            Our distributor program includes competitive pricing, marketing support, training materials, and access to our full product range. We work closely with partners to ensure mutual growth and success in your territory.
          </p>
        </div>
        <div>
          <img
            src="/World map.png"
            alt="Global distribution network"
            className="w-full h-auto rounded-lg shadow-sm object-cover"
          />
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-8 border border-gray-200 mb-16">
        <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">Benefits of Partnership</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">Competitive Margins</h3>
            <p className="text-gray-600 font-light text-sm">Attractive wholesale pricing with volume discounts and exclusive territory options.</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">Marketing Support</h3>
            <p className="text-gray-600 font-light text-sm">Professional marketing materials, product images, and promotional assets included.</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">Product Training</h3>
            <p className="text-gray-600 font-light text-sm">Comprehensive training on product features, application techniques, and troubleshooting.</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">Quality Guarantee</h3>
            <p className="text-gray-600 font-light text-sm">GMP-certified products with full compliance documentation and quality assurance.</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">Flexible Orders</h3>
            <p className="text-gray-600 font-light text-sm">Reasonable minimum order quantities with flexible reorder terms as you grow.</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">Dedicated Support</h3>
            <p className="text-gray-600 font-light text-sm">Direct access to our team for questions, support, and partnership development.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <img
            src="/Gemini_Generated_Image_l53oyml53oyml53o.png"
            alt="Global distribution network"
            className="w-full h-auto rounded-lg shadow-sm"
          />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Requirements</h2>
          <ul className="space-y-3 text-gray-600 font-light">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>Established business in beauty, cosmetics, or professional nail care sector</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>Existing distribution network or retail presence in your territory</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>Commitment to representing our brands professionally and ethically</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>Ability to meet minimum order requirements and maintain stock levels</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>Willingness to provide market feedback and collaborate on growth strategies</span>
            </li>
          </ul>
        </div>
      </div>
    </PageTemplate>
  );
}
