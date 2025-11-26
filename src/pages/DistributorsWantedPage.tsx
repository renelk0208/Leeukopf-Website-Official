import PageTemplate from '../components/PageTemplate';
import OptimizedImage from '../components/OptimizedImage';
import { RESPONSIVE_SIZES } from '../lib/responsive-sizes';
import { TrendingUp, Megaphone, GraduationCap, Award, RefreshCw, HeadphonesIcon } from 'lucide-react';

export default function DistributorsWantedPage() {
  const benefits = [
    {
      icon: TrendingUp,
      title: 'Competitive Margins',
      description: 'Attractive wholesale pricing with volume discounts and exclusive territory options.'
    },
    {
      icon: Megaphone,
      title: 'Marketing Support',
      description: 'Professional marketing materials, product images, and promotional assets included.'
    },
    {
      icon: GraduationCap,
      title: 'Product Training',
      description: 'Comprehensive training on product features, application techniques, and troubleshooting.'
    },
    {
      icon: Award,
      title: 'Quality Guarantee',
      description: 'GMP-certified products with full compliance documentation and quality assurance.'
    },
    {
      icon: RefreshCw,
      title: 'Flexible Orders',
      description: 'Reasonable minimum order quantities with flexible reorder terms as you grow.'
    },
    {
      icon: HeadphonesIcon,
      title: 'Dedicated Support',
      description: 'Direct access to our team for questions, support, and partnership development.'
    }
  ];

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

      {/* Premium Benefits of Partnership Section */}
      <div className="relative mb-10 sm:mb-12 md:mb-16 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-50 rounded-2xl"></div>
        
        <div className="relative rounded-2xl border border-blue-100 p-6 sm:p-8 md:p-10">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Benefits of Partnership</h2>
            <p className="text-gray-600 font-light max-w-2xl mx-auto text-sm sm:text-base">
              Join our network and unlock exclusive advantages that help your business thrive
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="group bg-white rounded-xl p-5 sm:p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 hover:-translate-y-1"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                    <benefit.icon size={24} className="text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-base sm:text-lg">{benefit.title}</h3>
                </div>
                <p className="text-gray-600 font-light text-sm sm:text-base leading-relaxed pl-0 sm:pl-16">{benefit.description}</p>
              </div>
            ))}
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
              <span className="text-blue-600 mr-2 flex-shrink-0">•</span>
              <span>Established business in beauty, cosmetics, or professional nail care sector</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2 flex-shrink-0">•</span>
              <span>Existing distribution network or retail presence in your territory</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2 flex-shrink-0">•</span>
              <span>Commitment to representing our brands professionally and ethically</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2 flex-shrink-0">•</span>
              <span>Ability to meet minimum order requirements and maintain stock levels</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2 flex-shrink-0">•</span>
              <span>Willingness to provide market feedback and collaborate on growth strategies</span>
            </li>
          </ul>
        </div>
      </div>
    </PageTemplate>
  );
}
