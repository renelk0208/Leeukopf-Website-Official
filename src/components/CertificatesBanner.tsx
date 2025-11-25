import { ArrowRight } from 'lucide-react';
import OptimizedImage from './OptimizedImage';

export default function CertificatesBanner() {
  const certifications = [
    {
      label: 'GMP Certified',
      image: '/img/certifications/png-transparent-gmp-logo-good-manufacturing-practice-logo-certification-good-manufacturing-practice-text-monochrome-quality-removebg-preview (1).png',
      alt: 'GMP Certified',
      width: 100,
      height: 36
    },
    {
      label: 'HEMA & TPO Free',
      image: '/viber_image_2025-11-12_13-54-58-003.png',
      alt: 'HEMA & TPO Free Logo',
      width: 100,
      height: 96
    },
    {
      label: 'Leaping Bunny Approved',
      image: '/viber_image_2025-11-12_13-55-24-523 copy copy.png',
      alt: 'Leaping Bunny Approved Cruelty Free Certification',
      width: 100,
      height: 96
    },
  ];

  return (
    <section className="border-t border-b border-gray-200 bg-white">
      {/* Responsive padding */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="group cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 rounded-lg p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center">
            {/* Text content - responsive typography */}
            <div className="space-y-3 sm:space-y-4 text-center lg:text-left">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                Certified. Compliant.{' '}
                <span className="relative inline-block">
                  Trusted.
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-700/30"></span>
                </span>
              </h3>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed font-light">
                GMP manufacturing, EU 1223/2009 compliance, CPNP registered, and HEMA & TPO-free systems.
              </p>
            </div>

            <div className="space-y-4 sm:space-y-6">
              {/* Responsive certification grid - scales from 3 columns to stacked on very small screens */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6">
                {certifications.map((cert, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center justify-center p-2 sm:p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-600 hover:shadow-md transition-all duration-300"
                  >
                    {/* Certification badges are small and above-fold on homepage, so eager load them */}
                    <OptimizedImage
                      src={cert.image}
                      alt={cert.alt}
                      width={cert.width}
                      height={cert.height}
                      lazy={index > 0}
                      className={cert.label === 'GMP Certified'
                        ? 'max-h-[24px] sm:max-h-[28px] md:max-h-[36px] w-auto object-contain mb-1 sm:mb-2'
                        : 'w-full h-16 sm:h-20 md:h-24 object-contain mb-1 sm:mb-2'}
                    />
                    <span className="text-[10px] sm:text-xs font-medium text-gray-700 text-center leading-tight">{cert.label}</span>
                  </div>
                ))}
              </div>

              {/* Full width button on mobile */}
              <button
                onClick={() => {
                  window.location.href = '/certificates-and-compliance';
                }}
                className="inline-flex items-center justify-center space-x-2 px-6 py-3 bg-blue-800 text-white rounded-md font-semibold hover:bg-blue-900 transition-all duration-300 shadow-sm hover:shadow-md w-full lg:w-auto min-h-[44px]"
              >
                <span>View Certificates</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
