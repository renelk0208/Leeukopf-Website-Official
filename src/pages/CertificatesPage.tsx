import { useState, useEffect, useCallback } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import OptimizedImage from '../components/OptimizedImage';
import { RESPONSIVE_SIZES } from '../lib/responsive-sizes';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function CertificatesPage() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const certificates = [
    {
      name: 'Bulgarian Chamber of Commerce & Industry Membership',
      image: '/img/Certifications-And-Compliance/bcci-chamber-2025.jpg',
      alt: 'Bulgarian Chamber of Commerce and Industry membership – Thermitek Ltd, valid 2025',
      description: 'Direct membership in the Bulgarian Chamber of Commerce and Industry, valid for 2025.',
      width: 800,
      height: 600
    },
    {
      name: 'Free Sale Certificate – Gel/Gel Polish Products',
      image: '/img/Certifications-And-Compliance/free-sale-certificate-2025-2026-1.jpg',
      alt: 'Free Sale Certificate 2025–2026 for gel/gel polish nail products',
      description: 'Confirms our gel/gel polish nail products are compliant and freely sold in Bulgaria and the European Community (valid 2025–2026).',
      width: 800,
      height: 600
    },
    {
      name: 'GMP Certificate – Cosmetics Manufacturing',
      image: '/img/Certifications-And-Compliance/gmp-certificate-2025-2026-1.jpg',
      alt: 'GMP Certificate 2025–2026 for manufacturing according to Good Manufacturing Practice for cosmetics',
      description: 'Certification for manufacturing according to Good Manufacturing Practice for cosmetics (GMP), valid 2025–2026.',
      width: 800,
      height: 600
    },
    {
      name: 'ISO 9001:2015 – Quality Management System',
      image: '/img/Certifications-And-Compliance/iso-9001-2025-2026.jpg',
      alt: 'ISO 9001:2015 Quality Management System certificate for Thermitek Ltd',
      description: 'ISO 9001:2015 certification for our quality management system and in-house laboratory.',
      width: 800,
      height: 600
    },
    {
      name: 'Leaping Bunny – Cruelty Free Certification',
      image: '/img/Certifications-And-Compliance/leaping-bunny-2025-2026.jpg',
      alt: 'Cruelty Free International Leaping Bunny Certificate of Approval, valid until 31 March 2026',
      description: 'Cruelty Free International Leaping Bunny approval for cosmetic and personal care products.',
      width: 800,
      height: 600
    },
    {
      name: 'BNAEOPC Membership – Essential Oils, Perfumery & Cosmetics',
      image: '/img/Certifications-And-Compliance/bnaeopc-membership-2025.jpg',
      alt: 'Bulgarian National Association Essential Oils, Perfumery and Cosmetics membership certificate 2025',
      description: 'Membership in the Bulgarian National Association Essential Oils, Perfumery and Cosmetics for 2025.',
      width: 800,
      height: 600
    }
  ];

  // Navigation functions for lightbox
  const goToNext = useCallback(() => {
    setLightboxIndex((prev) => (prev + 1) % certificates.length);
  }, [certificates.length]);

  const goToPrevious = useCallback(() => {
    setLightboxIndex((prev) => (prev - 1 + certificates.length) % certificates.length);
  }, [certificates.length]);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
    };

    // Store original overflow value to restore it properly
    const originalOverflow = document.body.style.overflow;
    
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [lightboxOpen, closeLightbox, goToNext, goToPrevious]);

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
              Thermitek Ltd and Leeukopf Laboratories operate under strict European regulations and internationally recognised standards. Below you can view our key certifications – click any document to view an enlarged version (images are blurred to protect sensitive information).
            </p>

            {/* Responsive certificates grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {certificates.map((cert, index) => (
                <button
                  key={cert.name}
                  onClick={() => {
                    setLightboxIndex(index);
                    setLightboxOpen(true);
                  }}
                  className="bg-white rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.08)] p-4 sm:p-6 md:p-7 hover:shadow-[0_6px_16px_rgba(0,0,0,0.12)] transition-shadow duration-300 block min-h-[44px] text-left w-full cursor-pointer"
                  aria-label={`View enlarged ${cert.name} (blurred for privacy)`}
                >
                  <div className="mb-4 sm:mb-5">
                    <OptimizedImage
                      src={cert.image}
                      alt={cert.alt}
                      width={cert.width}
                      height={cert.height}
                      sizes={RESPONSIVE_SIZES.threeColumn}
                      className="w-full h-auto rounded-md certificate-blurred"
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
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Certificate Lightbox Modal - always blurred */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setLightboxOpen(false);
            }
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="lightbox-title"
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10 min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Close lightbox"
          >
            <X size={32} />
          </button>

          {certificates.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-4 text-white hover:text-gray-300 transition-colors z-10 min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Previous certificate"
              >
                <ChevronLeft size={48} />
              </button>

              <button
                onClick={goToNext}
                className="absolute right-4 text-white hover:text-gray-300 transition-colors z-10 min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Next certificate"
              >
                <ChevronRight size={48} />
              </button>
            </>
          )}

          <div className="max-w-7xl max-h-[90vh] px-4 flex flex-col items-center">
            <h2 id="lightbox-title" className="sr-only">
              {certificates[lightboxIndex].name} - Certificate View (Blurred for Privacy)
            </h2>
            <img
              src={certificates[lightboxIndex].image}
              alt={certificates[lightboxIndex].alt}
              className="max-w-full max-h-[75vh] object-contain certificate-blurred"
            />
            <div className="text-white text-center mt-4">
              <p className="text-lg font-semibold">{certificates[lightboxIndex].name}</p>
              <p className="text-sm text-gray-300 mt-1">{certificates[lightboxIndex].description}</p>
              <p className="text-xs text-gray-400 mt-2 italic">Image blurred to protect sensitive information</p>
            </div>
          </div>

          {certificates.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
              {lightboxIndex + 1} / {certificates.length}
            </div>
          )}
        </div>
      )}

      <Footer />
    </div>
  );
}
