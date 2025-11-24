import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

export default function CertificatesPage() {
  const certificates = [
    {
      name: 'Bulgarian Chamber of Commerce & Industry Membership',
      image: '/img/Certifications-And-Compliance/bcci-chamber-2025.jpg',
      alt: 'Bulgarian Chamber of Commerce and Industry membership – Thermitek Ltd, valid 2025',
      description: 'Direct membership in the Bulgarian Chamber of Commerce and Industry, valid for 2025.'
    },
    {
      name: 'Free Sale Certificate – Gel/Gel Polish Products',
      image: '/img/Certifications-And-Compliance/free-sale-certificate-2025-2026-1.jpg',
      alt: 'Free Sale Certificate 2025–2026 for gel/gel polish nail products',
      description: 'Confirms our gel/gel polish nail products are compliant and freely sold in Bulgaria and the European Community (valid 2025–2026).'
    },
    {
      name: 'GMP Certificate – Cosmetics Manufacturing',
      image: '/img/Certifications-And-Compliance/gmp-certificate-2025-2026-1.jpg',
      alt: 'GMP Certificate 2025–2026 for manufacturing according to Good Manufacturing Practice for cosmetics',
      description: 'Certification for manufacturing according to Good Manufacturing Practice for cosmetics (GMP), valid 2025–2026.'
    },
    {
      name: 'ISO 9001:2015 – Quality Management System',
      image: '/img/Certifications-And-Compliance/iso-9001-2025-2026.jpg',
      alt: 'ISO 9001:2015 Quality Management System certificate for Thermitek Ltd',
      description: 'ISO 9001:2015 certification for our quality management system and in-house laboratory.'
    },
    {
      name: 'Leaping Bunny – Cruelty Free Certification',
      image: '/img/Certifications-And-Compliance/leaping-bunny-2025-2026.jpg',
      alt: 'Cruelty Free International Leaping Bunny Certificate of Approval, valid until 31 March 2026',
      description: 'Cruelty Free International Leaping Bunny approval for cosmetic and personal care products.'
    },
    {
      name: 'BNAEOPC Membership – Essential Oils, Perfumery & Cosmetics',
      image: '/img/Certifications-And-Compliance/bnaeopc-membership-2025.jpg',
      alt: 'Bulgarian National Association Essential Oils, Perfumery and Cosmetics membership certificate 2025',
      description: 'Membership in the Bulgarian National Association Essential Oils, Perfumery and Cosmetics for 2025.'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-grow">
        {/* Responsive header section */}
        <section className="py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">
              Certificates & Compliance
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-gray-600 font-light leading-relaxed max-w-4xl mx-auto text-center mb-8 sm:mb-12 md:mb-16 px-2">
              Thermitek Ltd and Leeukopf Laboratories operate under strict European regulations and internationally recognised standards. Below you can view our key certifications – click any document to open it in full size.
            </p>

            {/* Responsive certificates grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {certificates.map((cert) => (
                <a
                  key={cert.name}
                  href={cert.image}
                  className="bg-white rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.08)] p-4 sm:p-6 md:p-7 hover:shadow-[0_6px_16px_rgba(0,0,0,0.12)] transition-shadow duration-300 block min-h-[44px]"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View full size ${cert.name}`}
                >
                  <div className="mb-4 sm:mb-5">
                    <img
                      src={cert.image}
                      alt={cert.alt}
                      className="w-full h-auto rounded-md"
                      loading="lazy"
                    />
                  </div>
                  <div className="border-t border-gray-200 pt-4 sm:pt-5">
                    <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
                      {cert.name}
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-600 font-light leading-relaxed">
                      {cert.description}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
