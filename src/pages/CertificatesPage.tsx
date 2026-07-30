import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import PageTemplate from '../components/PageTemplate';
import OptimizedImage from '../components/OptimizedImage';
import { RESPONSIVE_SIZES } from '../lib/responsive-sizes';
import { X, ChevronLeft, ChevronRight, FileText } from 'lucide-react';

export default function CertificatesPage() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const certificates = [
    {
      name: 'Bulgarian Chamber of Commerce & Industry Membership',
      image: '/img/Certifications-And-Compliance/bcci-chamber-2025.jpg',
      alt: 'Bulgarian Chamber of Commerce and Industry membership – Thermitek Ltd',
      description: 'Direct membership in the Bulgarian Chamber of Commerce and Industry.',
      width: 800,
      height: 600
    },
    {
      name: 'Free Sale Certificate – Gel/Gel Polish Products',
      image: '/img/Certifications-And-Compliance/free-sale-certificate-2026-20271.jpg',
      alt: 'Free Sale Certificate for gel/gel polish nail products',
      description: 'Confirms our gel/gel polish nail products are compliant and freely sold in Bulgaria and the European Community.',
      width: 800,
      height: 600
    },
    {
      name: 'GMP Certificate – Cosmetics Manufacturing',
      image: '/img/Certifications-And-Compliance/GMP CERTIFICATE 2025-2026_page1.jpg',
      alt: 'GMP Certificate for manufacturing according to Good Manufacturing Practice for cosmetics',
      description: 'Certification for manufacturing according to Good Manufacturing Practice for cosmetics (GMP).',
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
      image: '/img/Certifications-And-Compliance/cruelty-free-international-26-27_page-0001.jpg',
      alt: 'Cruelty Free International Leaping Bunny Certificate of Approval',
      description: 'Cruelty Free International Leaping Bunny approval for cosmetic and personal care products.',
      width: 800,
      height: 600
    },
    {
      name: 'Bulgarian Cosmetics Association',
      image: '/img/Certifications-And-Compliance/bulgarian-cosmetics-membership-2025.jpg',
      alt: 'Bulgarian Cosmetics Association membership certificate',
      description: 'Membership in the Bulgarian Cosmetics Association.',
      width: 800,
      height: 600
    },
    {
      name: 'FDA Compliance Certificate',
      image: '/img/Certifications-And-Compliance/fda-compliance-certificate_page-0001.jpg',
      alt: 'FDA Compliance Certificate for cosmetic products',
      description: 'Certificate demonstrating compliance with FDA regulations for cosmetic products.',
      width: 800,
      height: 600
    },
    {
      name: 'SFDA Certificate of Conformity',
      image: '/img/Certifications-And-Compliance/sfda-certificate-of-conformity.jpg',
      alt: 'Saudi Food and Drug Authority Certificate of Conformity',
      description: 'Certificate of Conformity issued by the Saudi Food and Drug Authority (SFDA) for product registration and compliance.',
      width: 800,
      height: 600
    },
    {
      name: 'TPO-Free Compliance Certificate',
      image: '/img/Certifications-And-Compliance/s4648-01-TPOcompliance_page-0001.jpg',
      alt: 'TPO-Free Compliance Certificate for gel polish products',
      description: 'Certificate confirming our gel polish products are TPO-free (Trimethylbenzoyl Diphenylphosphine Oxide free), meeting safety standards for professional nail care.',
      width: 800,
      height: 600
    },
    {
      name: 'REACH & SVHC Compliance Declaration',
      image: '/img/Certifications-And-Compliance/reach-svhc-declaration-2026.jpg',
      alt: 'Thermitek Ltd / Leeukopf Laboratories REACH and SVHC packaging compliance declaration, issued 28 July 2026',
      description: 'Declares that packaging components used in our cosmetic products are sourced from suppliers providing REACH (EC 1907/2006) and SVHC (Article 33) compliance documentation.',
      width: 800,
      height: 600
    },
    {
      name: 'PPWR Declaration of Conformity',
      image: '/img/Certifications-And-Compliance/ppwr-declaration-of-conformity-2026.jpg',
      alt: 'Thermitek Ltd / Leeukopf Laboratories Packaging and Packaging Waste Regulation (EU) 2025/40 Declaration of Conformity, issued 28 July 2026',
      description: 'Confirms our packaging is sourced from manufacturers providing documentation on substance restrictions, recyclability, minimisation and labelling under PPWR (EU) 2025/40, Articles 5–12.',
      width: 800,
      height: 600
    },
    {
      name: 'Packaging Supplier – PPWR Article 5 Confirmation',
      image: '/img/Certifications-And-Compliance/ds-smith-ppwr-article5-confirmation.jpg',
      alt: 'Packaging manufacturer confirmation of compliance with Article 5 of the EU Packaging and Packaging Waste Regulation (PPWR)',
      description: 'Confirmation from one of our packaging manufacturers that packaging materials comply with the heavy metal and PFAS thresholds set out in Article 5 of the PPWR.',
      width: 800,
      height: 600
    },
    {
      name: 'Packaging Supplier – PFAS Information Sheet',
      image: '/img/Certifications-And-Compliance/ds-smith-pfas-information-sheet.jpg',
      alt: 'Packaging manufacturer information sheet on fluorinated substances (PFAS) in paper and board packaging',
      description: 'Technical information from one of our packaging manufacturers on per- and polyfluoroalkyl substances (PFAS) in paper and board packaging materials.',
      width: 800,
      height: 600
    },
    {
      name: 'Raw Material Supplier – SGS RoHS Test Report',
      image: '/img/Certifications-And-Compliance/sgs-rohs-test-report-pe-2426h.jpg',
      alt: 'SGS RoHS test report for polyethylene raw material grade 2426H, confirming compliance with Directive 2011/65/EU',
      description: 'Independent SGS test report confirming a key raw material (polyethylene grade 2426H) is free of restricted RoHS substances (cadmium, lead, mercury, hexavalent chromium, PBBs and PBDEs).',
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
    <PageTemplate
      title="Certificates & Compliance"
      subtitle="Thermitek Ltd and Leeukopf Laboratories operate under strict European regulations and internationally recognised standards. Below you can view our key certifications – click any document to view an enlarged version (images are blurred to protect sensitive information)."
      breadcrumbs={[
        { label: 'Home', path: '/' },
        { label: 'Certificates & Compliance' }
      ]}
      heroImage="/img/hero/certifications-compliance-hero.jpg"
    >
      {/* CPNP Compliance Support Banner */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <Link
          to="/cpnp-compliance-support"
          className="block card p-6 sm:p-8 bg-gradient-to-r from-primary-50 to-fuchsiaTint border-2 border-primary hover:border-primary-700 transition-all hover:shadow-xl group"
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 bg-primary rounded-lg flex items-center justify-center group-hover:bg-primary-700 transition-colors">
              <FileText className="text-white" size={28} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                EU CPNP Compliance Support for Private Label
              </h3>
              <p className="text-sm sm:text-base text-gray-700 mb-3">
                Looking to launch your gel polish brand in the EU? We provide full CPNP compliance support including safety assessments (CPSR), Product Information Files (PIF), and complete documentation packages.
              </p>
              <span className="inline-flex items-center text-primary font-semibold group-hover:text-primary-700 transition-colors">
                Learn more about our CPNP compliance services
                <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </div>
        </Link>
      </div>

      {/* Packaging Compliance (PPWR) Subsection */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 relative inline-block">
          EU Packaging Compliance (PPWR)
          <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-primary" aria-hidden="true"></span>
        </h2>
        <p className="text-sm sm:text-base text-gray-700 mb-6 max-w-3xl">
          The packaging documents shown below sit within the EU Packaging and Packaging Waste Regulation
          (PPWR, Regulation (EU) 2025/40). It sets harmonised rules on recyclability-by-design, recycled
          content, packaging minimisation, restricted substances and labelling. Our packaging is sourced
          and documented to align with these requirements as they phase in.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="card p-5 border-t-4 border-primary">
            <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">Recyclable by Design</h3>
            <p className="text-xs sm:text-sm text-gray-600">Materials chosen so packaging can be collected, sorted and recycled in practice.</p>
          </div>
          <div className="card p-5 border-t-4 border-primary">
            <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">Restricted Substances</h3>
            <p className="text-xs sm:text-sm text-gray-600">Heavy-metal and PFAS thresholds evidenced through supplier declarations and test reports.</p>
          </div>
          <div className="card p-5 border-t-4 border-primary">
            <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">Minimisation &amp; Labelling</h3>
            <p className="text-xs sm:text-sm text-gray-600">Right-sized packaging with material data to support your EPR reporting and on-pack marks.</p>
          </div>
        </div>

        <Link
          to="/packaging-compliance"
          className="inline-flex items-center text-primary font-semibold hover:text-primary-700 transition-colors"
        >
          Read our full guide to EU packaging compliance
          <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Responsive certificates grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {certificates.map((cert, index) => (
          <button
            key={cert.name}
            onClick={() => {
              setLightboxIndex(index);
              setLightboxOpen(true);
            }}
            className="card p-4 sm:p-6 md:p-7 hover:shadow-lg transition-shadow duration-300 block min-h-[44px] text-left w-full cursor-pointer"
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
            <X size={32} aria-hidden="true" />
          </button>

          {certificates.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-4 text-white hover:text-gray-300 transition-colors z-10 min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Previous certificate"
              >
                <ChevronLeft size={48} aria-hidden="true" />
              </button>

              <button
                onClick={goToNext}
                className="absolute right-4 text-white hover:text-gray-300 transition-colors z-10 min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Next certificate"
              >
                <ChevronRight size={48} aria-hidden="true" />
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
    </PageTemplate>
  );
}
