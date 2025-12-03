import { Link } from 'react-router-dom';
import PageTemplate from '../components/PageTemplate';
import StartHereBanner from '../components/StartHereBanner';
import { Beaker, Settings, ShieldCheck, Handshake, Users, Building2, GraduationCap, CheckCircle } from 'lucide-react';

export default function PrivateLabelPage() {
  // Benefits items with icons and English content
  const benefitItems = [
    { 
      key: 'expertise',
      icon: Beaker,
      title: 'Laboratory and manufacturing expertise',
      text: 'Formulas created and produced in our own lab and factory, with experience across different markets and service types.'
    },
    { 
      key: 'flexibility',
      icon: Settings,
      title: 'Flexible range building',
      text: 'Start with a focused core selection or build a full catalogue. We help you choose systems and shades that fit your positioning.'
    },
    { 
      key: 'compliance',
      icon: ShieldCheck,
      title: 'Regulatory support',
      text: 'Guidance on EU cosmetic compliance, documentation and registration so you can bring products to market with confidence.'
    },
    { 
      key: 'partnership',
      icon: Handshake,
      title: 'Long-term partnership',
      text: 'We see private label as an ongoing collaboration – from first launch to future updates, seasonal collections and reformulations.'
    },
  ];

  // Process steps with English content
  const processSteps = [
    {
      key: 'consultation',
      title: '1. Initial consultation',
      text: 'We discuss your brand, target markets, service types and price positioning. Together we define what you really need from your product line.'
    },
    {
      key: 'selection',
      title: '2. Product and shade selection',
      text: 'Based on your goals, we suggest suitable systems (gel polish, bases, builders, etc.) and prepare a proposed shade range or collections for sampling.'
    },
    {
      key: 'sampling',
      title: '3. Sampling and testing',
      text: 'You test the products in real salon conditions. We refine the selection if needed, based on your feedback and the results from your technicians.'
    },
    {
      key: 'packaging',
      title: '4. Packaging and design',
      text: 'You can use our existing packaging options or work with us on custom solutions. We provide technical specifications to your designer so artwork fits correctly.'
    },
    {
      key: 'compliance',
      title: '5. Documentation & compliance',
      text: 'For EU projects, we support PIF preparation and CPNP notifications in cooperation with your appointed safety assessor and responsible person.'
    },
    {
      key: 'production',
      title: '6. Production and delivery',
      text: 'Once everything is approved, we schedule production, filling and packing according to agreed MOQs and lead times, and arrange shipment.'
    },
  ];

  // Who is for items with icons and English content
  const whoIsForItems = [
    { 
      key: 'distributors',
      icon: Building2,
      title: 'Distributors and wholesalers',
      text: 'Businesses that already supply salons or retailers and want a professional in-house brand.'
    },
    { 
      key: 'brands',
      icon: Users,
      title: 'Existing brands',
      text: 'Brands that need to upgrade formulas, expand their range or add professional-only product lines.'
    },
    { 
      key: 'educators',
      icon: GraduationCap,
      title: 'Training academies',
      text: 'Educators who want product lines that support their teaching and are consistent for students and salons.'
    },
  ];

  return (
    <PageTemplate
      title="Private label gel systems for serious brands"
      subtitle="We develop, manufacture and fill professional gel systems under your own brand name, with full technical and regulatory support."
      breadcrumbs={[
        { label: 'Home', path: '/' },
        { label: 'Private Label' }
      ]}
      showCTA={true}
      ctaText="Start a private label project"
      heroImage="/img/hero/private-label-hero.jpg"
    >
      {/* Start Your Brand Banner */}
      <StartHereBanner />

      {/* Hero CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10 sm:mb-12 md:mb-16">
        <Link
          to="/contact"
          className="btn-primary px-6 py-3 rounded-lg font-semibold text-center"
        >
          Start a private label project
        </Link>
        <Link
          to="/contact"
          className="btn-secondary px-6 py-3 rounded-lg font-semibold text-center"
        >
          Request more information
        </Link>
      </div>

      {/* Intro Section */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6 relative inline-block">
          More than a logo on a bottle
          <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-primary" aria-hidden="true"></span>
        </h2>
        <p className="text-gray-600 font-light leading-relaxed text-sm sm:text-base max-w-3xl">
          Launching or expanding a professional nail brand requires more than nice packaging. You need reliable formulas, clear documentation and a manufacturing partner who understands your market. That is where we come in.
        </p>
      </div>

      {/* Benefits Section */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 sm:mb-8 text-center">
          What you gain with our private label services
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {benefitItems.map((item) => (
            <div
              key={item.key}
              className="bg-white rounded-lg border border-gray-200 p-5 sm:p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
                  <item.icon size={24} className="text-primary" aria-hidden="true" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2 text-base sm:text-lg">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 font-light text-sm sm:text-base leading-relaxed">
                    {item.text}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Process Section */}
      <div className="bg-gray-50 rounded-lg p-5 sm:p-6 md:p-8 border border-gray-200 mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 sm:mb-8 text-center">
          How the private label process works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {processSteps.map((step) => (
            <div
              key={step.key}
              className="bg-white rounded-lg p-4 sm:p-5 border border-gray-200"
            >
              <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
                {step.title}
              </h3>
              <p className="text-gray-600 font-light text-xs sm:text-sm leading-relaxed">
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* MOQs Section */}
      <div className="bg-white rounded-lg p-5 sm:p-6 md:p-8 border border-gray-200 mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">
          Minimum order quantities and lead times
        </h2>
        <p className="text-gray-600 font-light leading-relaxed text-sm sm:text-base mb-4">
          MOQs and timelines depend on the product type, packaging choice and whether we are using existing shades or creating something new. During the first consultation we will give you realistic numbers and timeframes.
        </p>
        <ul className="space-y-2">
          {['Different MOQs for bottles, jars and bulk', 'Standard lead times for repeat orders after first setup', 'Clear communication if anything affects production schedules'].map((bullet, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Who Is For Section */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 sm:mb-8 text-center">
          Who our private label services are ideal for
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {whoIsForItems.map((item) => (
            <div
              key={item.key}
              className="bg-white rounded-lg border border-gray-200 p-5 sm:p-6 text-center hover:shadow-lg transition-shadow"
            >
              <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <item.icon size={32} className="text-primary" aria-hidden="true" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-base sm:text-lg">
                {item.title}
              </h3>
              <p className="text-gray-600 font-light text-sm sm:text-base leading-relaxed">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-50 rounded-lg p-5 sm:p-6 md:p-8 text-center">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
          Ready to talk about your own brand?
        </h2>
        <p className="text-gray-600 font-light leading-relaxed text-sm sm:text-base mb-6 max-w-2xl mx-auto">
          Tell us a little about your business, your market and what you want to achieve. We will come back with a realistic, honest proposal – not just a generic price list.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/contact"
            className="btn-primary px-6 py-3 rounded-lg font-semibold"
          >
            Send us your project details
          </Link>
          <Link
            to="/contact"
            className="btn-secondary px-6 py-3 rounded-lg font-semibold"
          >
            Book an online meeting
          </Link>
        </div>
      </div>
    </PageTemplate>
  );
}
