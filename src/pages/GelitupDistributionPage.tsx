import PageTemplate from '../components/PageTemplate';
import OptimizedImage from '../components/OptimizedImage';
import InstagramFeed from '../components/InstagramFeed';
import DistributorMap from '../components/DistributorMap';
import { RESPONSIVE_SIZES } from '../lib/responsive-sizes';
import { CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function GelitupDistributionPage() {
  const navigate = useNavigate();

  return (
    <PageTemplate
      title="Gelitup Distribution"
      subtitle="Discover GEL.IT.UP by GIUP® and join our global network of distributors bringing premium professional nail products to markets worldwide."
      breadcrumbs={[
        { label: 'Home', path: '/' },
        { label: 'Gelitup Distribution' }
      ]}
      showCTA={true}
      ctaText="Become a Distributor"
      heroImage="/img/hero/our-brand-hero.jpg"
    >
      <div className="grid grid-cols-1 gap-8 sm:gap-10 md:gap-12">
        {/* Call to Action Banner - Moved to top */}
        <section className="bg-primary text-white rounded-lg p-6 sm:p-8 md:p-10 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              Built for professionals. Trusted by Distributors.
            </h2>
            <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-white/90">
              Join our growing global network of distributors
            </p>
            <button
              onClick={() => navigate('/client-registration')}
              className="bg-white text-primary hover:bg-gray-100 font-semibold px-8 sm:px-10 py-3 sm:py-4 rounded-lg text-base sm:text-lg transition-colors duration-200 inline-flex items-center justify-center min-h-[48px]"
            >
              Apply Now
            </button>
          </div>
        </section>

        {/* GEL.IT.UP Brand Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 p-4 sm:p-6 md:p-8 bg-white rounded-lg border border-gray-200">
          <div className="order-1">
            <OptimizedImage
              src="/GEL.IT.UP-NEW-LOGO-2024_black_2.png"
              alt="GEL.IT.UP products"
              width={800}
              height={400}
              sizes={RESPONSIVE_SIZES.twoColumn}
              className="w-full h-auto rounded-lg object-contain"
            />
          </div>
          <div className="flex flex-col justify-center order-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">GEL.IT.UP by GIUP®</h2>
            <p className="text-gray-600 font-light leading-relaxed text-sm sm:text-base md:text-lg">
              Founded in 2011, GEL.IT.UP by GIUP® stands for Superior Innovation — delivering professional-grade nail products that meet strict EU regulations and global GMP standards.
            </p>
            <p className="text-gray-600 font-light leading-relaxed text-sm sm:text-base md:text-lg mt-4">
              We are proudly cruelty-free (Leaping Bunny certified) and distribute exclusively to industry professionals to uphold the highest standards.
            </p>
            <p className="text-gray-600 font-light leading-relaxed text-sm sm:text-base md:text-lg mt-4">
              With personal 1-on-1 support, a growing global distributor family, and a strong commitment to sustainability and inclusivity, we believe in responsible beauty for a healthier, more respectful world.
            </p>
            <div className="mt-4 sm:mt-6">
              <a
                href="https://www.gelitup.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-800 font-semibold hover:text-blue-900 inline-flex items-center min-h-[44px] text-sm sm:text-base"
              >
                Explore GEL.IT.UP →
              </a>
            </div>
          </div>
        </div>

        {/* Key Features Section */}
        <section className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg border border-primary/20 p-6 sm:p-8 md:p-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
              Why Partner with GEL.IT.UP?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                    180+ BEST-SELLING SKUs
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                    The shades professionals reorder again and again.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                    FAST DISPATCH - JUST 1 WEEK
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                    Because your shelves shouldn't wait.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                    HEMA &amp; TPO FREE
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                    Formulated for today's regulatory landscape.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                    FULLY COMPLIANT
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                    CPNP registered | SFDA Ready | ISO 9001 | ISO 22716
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Distributor Map Section */}
        <DistributorMap />

        {/* Instagram Feed Section */}
        <div className="mt-4 sm:mt-6 md:mt-8">
          <InstagramFeed brand="gelitup" />
        </div>
      </div>
    </PageTemplate>
  );
}
