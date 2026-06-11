import PageTemplate from '../components/PageTemplate';
import StartHereBanner from '../components/StartHereBanner';
import { CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DistributorsWantedPage() {
  const navigate = useNavigate();

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
      heroImage="/img/hero/distributors-wanted-hero-image-1.jpg"
    >
      {/* Start Your Brand Banner */}
      <StartHereBanner />

      {/* Apply to Distribute Section */}
      <section className="mb-10 sm:mb-12 md:mb-16">
        <div className="card p-6 sm:p-8 md:p-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 tracking-tight">
              Apply to Distribute
            </h2>
            <p className="text-base sm:text-lg text-gray-700 mb-6 leading-relaxed">
              We partner with established beauty distributors committed to premium brands and long-term growth.
            </p>
            <ul className="space-y-3 sm:space-y-4">
              <li className="flex items-start gap-3 sm:gap-4">
                <div className="flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Active presence in beauty or professional nail care
                </p>
              </li>
              <li className="flex items-start gap-3 sm:gap-4">
                <div className="flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Strong local retail or distribution network
                </p>
              </li>
              <li className="flex items-start gap-3 sm:gap-4">
                <div className="flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Commitment to premium brand standards
                </p>
              </li>
              <li className="flex items-start gap-3 sm:gap-4">
                <div className="flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Capacity to meet minimum volumes and manage stock
                </p>
              </li>
              <li className="flex items-start gap-3 sm:gap-4">
                <div className="flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Collaborative, growth-focused approach
                </p>
              </li>
            </ul>
            <div className="mt-6 sm:mt-8 text-center">
              <button
                onClick={() => navigate('/client-registration')}
                className="btn-primary px-6 sm:px-8 py-3 sm:py-4"
              >
                Apply to Distribute
              </button>
            </div>
          </div>
        </div>
      </section>
    </PageTemplate>
  );
}
