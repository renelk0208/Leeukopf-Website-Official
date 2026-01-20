import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import OptimizedImage from './OptimizedImage';

export default function CertificatesBanner() {
  const navigate = useNavigate();
  const certifications = [
    {
      label: 'GMP Certified',
      image: '/img/certifications/gmp-icon.png',
      alt: 'GMP Certified',
      width: 120,
      height: 120
    },
    {
      label: 'HEMA & TPO Free',
      image: '/viber_image_2025-11-12_13-54-58-003.png',
      alt: 'HEMA & TPO Free Logo',
      width: 120,
      height: 120
    },
    {
      label: 'Leaping Bunny Approved',
      image: '/img/certifications/leaping-bunny-icon.png',
      alt: 'Leaping Bunny Approved Cruelty Free Certification',
      width: 120,
      height: 120
    },
    {
      label: 'CPNP Registered',
      image: '/img/certifications/tuv-austria-icon.png',
      alt: 'CPNP Registered - EU Cosmetic Product Notification Portal',
      width: 120,
      height: 120
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
              {/* Responsive certification grid - scales from 4 columns to 2 on smaller screens */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                {certifications.map((cert, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center justify-center p-3 sm:p-4 md:p-5 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-600 hover:shadow-md transition-all duration-300"
                  >
                    {/* Certification badges are small and above-fold on homepage, so eager load them */}
                    <OptimizedImage
                      src={cert.image}
                      alt={cert.alt}
                      width={cert.width}
                      height={cert.height}
                      lazy={index > 0}
                      className='w-full h-20 sm:h-24 md:h-28 object-contain mb-2 sm:mb-3'
                    />
                    <span className="text-xs sm:text-sm font-semibold text-gray-800 text-center leading-tight">{cert.label}</span>
                  </div>
                ))}
              </div>

              {/* Full width button on mobile */}
              <button
                onClick={() => navigate('/certificates-and-compliance')}
                className="inline-flex items-center justify-center space-x-2 px-6 py-3 bg-blue-800 text-white rounded-md font-semibold hover:bg-blue-900 transition-all duration-300 shadow-sm hover:shadow-md w-full lg:w-auto min-h-[44px]"
              >
                <span>View Certificates</span>
                <ArrowRight size={18} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
