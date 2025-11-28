import PageTemplate from '../components/PageTemplate';
import OptimizedImage from '../components/OptimizedImage';
import { RESPONSIVE_SIZES } from '../lib/responsive-sizes';
import { Handshake, Gift, UserCheck, CheckCircle } from 'lucide-react';
import { ComponentType } from 'react';

interface FeatureBlock {
  title: string;
  bullets: string[];
  icon: ComponentType<{ className?: string }>;
}

const featureBlocks: FeatureBlock[] = [
  {
    title: 'Why Partner With Us',
    bullets: [
      'Premium gel polish systems and professional nail care products',
      'GMP-certified manufacturing with EU compliance',
      'Comprehensive support to help you succeed',
      'Close collaboration for mutual growth in your territory'
    ],
    icon: Handshake
  },
  {
    title: 'What You Gain',
    bullets: [
      'Competitive wholesale pricing with volume discounts',
      'Professional marketing materials and product images',
      'Comprehensive product training and troubleshooting',
      'Full access to our complete product range'
    ],
    icon: Gift
  },
  {
    title: 'Your Role as Distributor',
    bullets: [
      'Exclusive territory options available',
      'Flexible reorder terms as your business grows',
      'Direct access to our support team',
      'Partnership development and promotional assets'
    ],
    icon: UserCheck
  }
];

const requirements = [
  {
    bold: 'Established business',
    text: 'in the beauty, cosmetics, or professional nail care sector'
  },
  {
    bold: 'Existing distribution network or retail presence',
    text: 'in your territory'
  },
  {
    bold: 'Strong commitment',
    text: 'to representing our brands professionally and ethically'
  },
  {
    bold: 'Ability to meet minimum order volumes',
    text: 'and maintain appropriate stock levels'
  },
  {
    bold: 'Willingness to collaborate',
    text: 'on growth strategies and provide regular market feedback'
  }
];

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
      heroImage="/img/hero/Product Images (14).jpg"
    >
      {/* Responsive intro section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 mb-10 sm:mb-12 md:mb-16">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6 relative inline-block">
            Partner With Us
            <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-primary" aria-hidden="true"></span>
          </h2>
          <p className="text-gray-600 mb-4 font-light leading-relaxed text-sm sm:text-base">
            We are actively seeking distribution partners worldwide to expand our reach and bring our premium gel polish systems, builder gels, and professional nail care products to new markets. Whether you're an established distributor or looking to enter the beauty industry, we offer comprehensive support to help you succeed.
          </p>
          <p className="text-gray-600 font-light leading-relaxed text-sm sm:text-base">
            Our distributor program includes competitive pricing, marketing support, training materials, and access to our full product range. We work closely with partners to ensure mutual growth and success in your territory.
          </p>
        </div>
        <div className="image-frame">
          <OptimizedImage
            src="/World map.png"
            alt="Global distribution network"
            width={1200}
            height={800}
            sizes={RESPONSIVE_SIZES.twoColumn}
            className="w-full h-auto object-cover"
          />
        </div>
      </div>

      {/* Premium 3-Card Benefits Section - Swipeable on mobile, 3-column on desktop */}
      <section className="py-6 sm:py-8 md:py-10 mb-8 sm:mb-10 md:mb-12">
        <div className="max-w-6xl mx-auto">
          {/* Section heading */}
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 tracking-tight">
              Benefits of Partnership
            </h2>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto font-light">
              Join our network and unlock exclusive advantages that help your business thrive
            </p>
          </div>

          {/* Horizontally scrollable on mobile, 3-column grid on desktop */}
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:pb-0 scrollbar-hide">
            {featureBlocks.map((block, index) => {
              const IconComponent = block.icon;
              return (
                <article
                  key={index}
                  className="card flex-shrink-0 w-[280px] sm:w-[300px] md:w-auto snap-start p-4 sm:p-5 hover:shadow-lg transition-shadow duration-200"
                >
                  {/* Icon - Berry colour */}
                  <div className="w-10 h-10 bg-primary text-white rounded-lg flex items-center justify-center mb-3">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  {/* Title */}
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 leading-tight">
                    {block.title}
                  </h3>
                  {/* Bullet points - Berry colour bullets */}
                  <ul className="space-y-1.5">
                    {block.bullets.map((bullet, bulletIndex) => (
                      <li key={bulletIndex} className="flex items-start gap-2 text-xs sm:text-sm text-gray-600 font-light leading-snug">
                        <span className="text-primary mt-1 flex-shrink-0">•</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Requirements Section - Updated with unified card styling */}
      <section className="mb-10 sm:mb-12 md:mb-16">
        <div className="card section-gradient-secondary p-6 sm:p-8 md:p-10">
          <div className="max-w-4xl mx-auto">
            {/* Section heading */}
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 tracking-tight">
                Requirements to Become a Distributor
              </h2>
            </div>

            {/* Requirements list - Berry icons */}
            <ul className="space-y-4 sm:space-y-5">
              {requirements.map((req, index) => (
                <li key={index} className="flex items-start gap-3 sm:gap-4">
                  <div className="flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed">
                    <span className="font-semibold text-gray-900">{req.bold}</span> {req.text}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Distribution Partnership Image - with image-frame styling */}
      <div className="flex justify-center">
        <div className="image-frame w-full max-w-2xl">
          <OptimizedImage
            src="/distribution partnership.png"
            alt="Distribution partnership"
            width={1024}
            height={1536}
            sizes={RESPONSIVE_SIZES.twoColumn}
            className="w-full h-auto"
          />
        </div>
      </div>
    </PageTemplate>
  );
}
