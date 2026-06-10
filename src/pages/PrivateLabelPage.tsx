import { Link } from 'react-router-dom';
import PageTemplate from '../components/PageTemplate';
import StartHereBanner from '../components/StartHereBanner';
import VideoGallery from '../components/VideoGallery';
import { Beaker, Settings, ShieldCheck, Handshake, Users, Building2, GraduationCap, CheckCircle } from 'lucide-react';

export default function PrivateLabelPage() {
  // Bottle videos for the gallery
  const bottleVideos = [
    { src: '/videos/bottles/rotating-bottles (2).MP4', title: 'Premium bottle presentation' },
    { src: '/videos/bottles/rotating-bottles (3).MP4', title: 'Professional bottle display' },
    { src: '/videos/bottles/rotating-bottles (4).MP4', title: 'Elegant bottle rotation' },
    { src: '/videos/bottles/rotating-bottles (5).MP4', title: 'Quality bottle showcase' },
    { src: '/videos/bottles/rotating-bottles (6).MP4', title: 'Custom branded bottle' },
    { src: '/videos/bottles/rotating-bottles (7).MP4', title: 'Professional packaging solution' },
    { src: '/videos/bottles/rotating-bottles (9).MP4', title: 'Branded bottle presentation' },
    { src: '/videos/bottles/rotating-bottles (10).MP4', title: 'Rotating bottle display' },
    { src: '/videos/bottles/rotating-bottles (11).MP4', title: 'Quality packaging showcase' },
    { src: '/videos/bottles/rotating-bottles (12).MP4', title: 'Professional bottle solution' },
    { src: '/videos/bottles/rotating-bottles (13).MP4', title: 'Premium bottle display' },
    { src: '/videos/bottles/rotating-bottles (14).MP4', title: 'Custom bottle presentation' },
  ];

  // Benefits items with icons and updated headers
  const benefitItems = [
    { 
      key: 'expertise',
      icon: Beaker,
      title: 'In-house lab. Real expertise.',
      text: 'Formulas created and produced in our own lab and factory, with experience across different markets and service types.'
    },
    { 
      key: 'flexibility',
      icon: Settings,
      title: 'Start small. Scale when ready.',
      text: 'Start with a focused core selection or build a full catalogue. We help you choose systems and shades that fit your positioning.'
    },
    { 
      key: 'compliance',
      icon: ShieldCheck,
      title: 'EU compliance, handled.',
      text: 'Guidance on EU cosmetic compliance, documentation and registration so you can bring products to market with confidence.'
    },
    { 
      key: 'partnership',
      icon: Handshake,
      title: 'A partner, not just a supplier.',
      text: 'We see private label as an ongoing collaboration – from first launch to future updates, seasonal collections and reformulations.'
    },
  ];

  // Process: 3 phases (condensed from 6 steps)
  const processPhases = [
    {
      key: 'consult',
      title: 'Phase 1 — Consult & Define',
      text: 'We learn about your brand, your market, and your goals — then propose the right systems and shades.',
    },
    {
      key: 'sample',
      title: 'Phase 2 — Sample & Refine',
      text: 'You test real products in real conditions. We adjust formulas, finalize packaging, and get everything right before production.',
    },
    {
      key: 'produce',
      title: 'Phase 3 — Produce & Deliver',
      text: 'We handle compliance documentation, production, filling, and shipment. You receive finished, market-ready products.',
    },
  ];

  // Who this is for — audience types reframed for brand owners
  const whoIsForItems = [
    { 
      key: 'starters',
      icon: Users,
      title: 'Starting a new nail brand',
      text: "You've got the vision and the market. We'll give you the formulas, the documentation, and a manufacturer that actually picks up the phone.",
    },
    { 
      key: 'brands',
      icon: Building2,
      title: 'Expanding an existing brand',
      text: 'Ready to add gel systems, upgrade your formula, or launch a professional-only line? We make it straightforward.',
    },
    { 
      key: 'educators',
      icon: GraduationCap,
      title: 'Running a training academy',
      text: 'Build consistency for your students with your own branded product line — formulated to perform, priced to teach with.',
    },
  ];

  return (
    <PageTemplate
      title="Your Brand. Our Lab."
      subtitle="We develop, manufacture, and fill gel polish under your name — with full regulatory support and no hidden complexity."
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
          to="/client-registration"
          className="btn-primary px-6 py-3 rounded-lg font-semibold text-center"
        >
          Start a private label project
        </Link>
        <Link
          to="/client-registration"
          className="btn-secondary px-6 py-3 rounded-lg font-semibold text-center"
        >
          Request more information
        </Link>
      </div>

      {/* Who This Is For — moved to top so visitors see themselves immediately */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 sm:mb-8 text-center">
          Is this right for you?
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

      {/* Intro Section */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6 relative inline-block">
          More than a logo on a bottle
          <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-primary" aria-hidden="true"></span>
        </h2>
        <p className="text-gray-600 font-light leading-relaxed text-sm sm:text-base max-w-3xl">
          A real brand needs reliable formulas, clean documentation, and a manufacturer who understands your market — not just sends invoices. That's what we're here for.
        </p>
      </div>

      {/* Bottle Video Gallery Section */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <VideoGallery
          videos={bottleVideos}
          title="Our premium bottle solutions"
          subtitle="Premium bottles available for custom branding"
        />
      </div>

      {/* Private Label Categories Section */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        {/* Packaging note */}
        <p className="text-xs text-gray-400 font-light mb-6 sm:mb-8">
          Packaging shown is available for private label branding. Speak to us about additional options for your brand.
        </p>

        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 sm:mb-8 text-center">
          Private label packaging options
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Bottles */}
          <Link
            to="/private-label/bottles"
            className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="aspect-[4/3] bg-gray-50 relative overflow-hidden">
              <img
                src="/img/private-label/bottles/bottles-image-private label-solutions.jpg"
                alt="Bottles - Premium gel polish bottles for custom branding"
                width="1600"
                height="1200"
                className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Bottles
              </h3>
              <p className="text-sm text-gray-600 font-light leading-relaxed">
                Premium gel polish bottles available for custom branding. Multiple sizes and finishes to match your brand aesthetic.
              </p>
            </div>
          </Link>

          {/* Bulk */}
          <Link
            to="/private-label/bulk"
            className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="aspect-[4/3] bg-gray-50 relative overflow-hidden">
              <img
                src="/img/private-label/bulk/bulk-5kg-bucket.jpg"
                alt="Bulk Packaging - High-volume gel and builder systems"
                width="1600"
                height="1200"
                className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Bulk Packaging
              </h3>
              <p className="text-sm text-gray-600 font-light leading-relaxed">
                For high-volume partners, we supply gel and builder systems in bulk formats ready for your own filling and logistics.
              </p>
            </div>
          </Link>

          {/* Jars & Tubes (Full Gallery) */}
          <Link
            to="/private-label/jars-and-tubes"
            className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="aspect-[4/3] bg-gray-50 relative overflow-hidden">
              <img
                src="/img/products/jars-and-tubes/website_leeukopf_colored_jar_1.jpg"
                alt="Jars & Tubes - Complete collection of packaging options"
                width="1600"
                height="1200"
                className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Jars & Tubes
              </h3>
              <p className="text-sm text-gray-600 font-light leading-relaxed">
                Browse our complete collection of acrylic jars, tubes, and specialty packaging in various sizes and colors.
              </p>
            </div>
          </Link>
        </div>
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

      {/* Process Section — 3 phases */}
      <div className="bg-gray-50 rounded-lg p-5 sm:p-6 md:p-8 border border-gray-200 mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 sm:mb-8 text-center">
          How the private label process works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {processPhases.map((phase) => (
            <div
              key={phase.key}
              className="bg-white rounded-lg p-4 sm:p-5 border border-gray-200"
            >
              <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
                {phase.title}
              </h3>
              <p className="text-gray-600 font-light text-xs sm:text-sm leading-relaxed">
                {phase.text}
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
          {/* TODO: Replace [X] with your actual starting MOQ per shade */}
          Most first launches start from 25 pieces per colour (bottled) or 1kg per shade (bulk). We'll confirm exact numbers for your specific packaging in your first consultation.
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
            to="/client-registration"
            className="btn-primary px-6 py-3 rounded-lg font-semibold"
          >
            Send us your project details
          </Link>
          <Link
            to="/client-registration"
            className="btn-secondary px-6 py-3 rounded-lg font-semibold"
          >
            Book an online meeting
          </Link>
        </div>
      </div>
    </PageTemplate>
  );
}
