import { useState, useEffect, useCallback } from 'react';
import PageTemplate from '../components/PageTemplate';
import { CheckCircle, AlertTriangle, Info, Recycle, Package, FileText, X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function PackagingCompliancePage() {
  const [gallery, setGallery] = useState<{ images: string[]; index: number } | null>(null);

  const closeGallery = useCallback(() => setGallery(null), []);
  const nextPage = useCallback(() => {
    setGallery((g) => (g ? { ...g, index: (g.index + 1) % g.images.length } : g));
  }, []);
  const prevPage = useCallback(() => {
    setGallery((g) => (g ? { ...g, index: (g.index - 1 + g.images.length) % g.images.length } : g));
  }, []);

  useEffect(() => {
    if (!gallery) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeGallery();
      if (e.key === 'ArrowRight') nextPage();
      if (e.key === 'ArrowLeft') prevPage();
    };
    const previousOverflow = document.body.style.overflow;
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [gallery, closeGallery, nextPage, prevPage]);


  const obligations = [
    {
      title: 'Recyclability by Design',
      description: 'From 2030, all packaging placed on the EU market must be designed for recycling (DfR) and meet performance grades. From 2035, packaging must also be recyclable at scale.'
    },
    {
      title: 'Recycled Content Targets',
      description: 'Plastic packaging must contain minimum percentages of post-consumer recycled (PCR) content, with staged targets in 2030 and 2040 depending on the plastic type and application.'
    },
    {
      title: 'Packaging Minimisation',
      description: 'Empty space and unnecessary layers must be reduced. Packaging weight and volume must be limited to the minimum required for functionality, safety and consumer acceptance.'
    },
    {
      title: 'Substances of Concern',
      description: 'Restrictions on certain substances (e.g. above-threshold PFAS in food-contact packaging) and lead, cadmium, mercury and hexavalent chromium concentration limits.'
    },
    {
      title: 'Labelling & Marking',
      description: 'Harmonised labels indicating material composition and sorting instructions, so consumers can dispose of packaging in the correct waste stream.'
    },
    {
      title: 'EPR & Reporting',
      description: 'Extended Producer Responsibility fees and registration in each market where packaging is placed, with regular reporting of quantities and materials.'
    }
  ];

  const timeline = [
    { year: '2024', title: 'PPWR Adopted', description: 'Regulation (EU) 2025/40 on Packaging and Packaging Waste enters into force, repealing Directive 94/62/EC.' },
    { year: '2026', title: 'Application Begins', description: 'Core provisions of the PPWR start to apply across all EU member states (18 months after entry into force).' },
    { year: '2030', title: 'Design & Content Rules', description: 'Recyclability-by-design, recycled content minimums, and packaging minimisation obligations take effect.' },
    { year: '2035', title: 'Recycling at Scale', description: 'Packaging must be demonstrably recycled at scale to remain on the EU market.' },
    { year: '2040', title: 'Higher Targets', description: 'Increased recycled content thresholds and stricter recyclability performance grades apply.' }
  ];

  const materials = [
    { icon: '🍶', name: 'Glass Bottles', note: 'Widely recyclable — collected in dedicated glass streams' },
    { icon: '🧴', name: 'Plastic Caps & Brushes', note: 'Separated for polymer recycling where infrastructure exists' },
    { icon: '📦', name: 'Cardboard Cartons', note: 'FSC-sourced, fully recyclable paper-based packaging' },
    { icon: '🏷️', name: 'Labels & Inks', note: 'Low-migration, recycling-compatible label materials' }
  ];

  const DOCS_BASE = '/img/packaging-compliance';
  const SUPPLIER_BASE = `${DOCS_BASE}/Supplier-declarations`;

  // Encode each path segment while preserving the folder separators.
  const toUrl = (path: string) =>
    path
      .split('/')
      .map((segment, index) => (index === 0 && segment === '' ? '' : encodeURIComponent(segment)))
      .join('/');

  // Build the page list for a multi-page document (e.g. "name-1.webp" ... "name-N.webp").
  const seq = (base: string, count: number) =>
    Array.from({ length: count }, (_, i) => `${base}-${i + 1}.webp`);

  // Each document is a group of one or more page images (grouped when multi-page).
  const declarations: string[][] = [
    seq(`${DOCS_BASE}/Thermitek - PPWR COMPLIANCE DECLARATION - 28.7.2026`, 2),
    [`${DOCS_BASE}/Thermitek - REACH & SVHC COMPLIANCE DECLARATION - 28.7.2026.webp`]
  ];

  // Each supplier document is a group of one or more page images (kept together
  // and shown in order). Only files that exist on disk are referenced.
  const supplierDocs: string[][] = [
    seq(`${SUPPLIER_BASE}/INK/ABS Copy`, 8),
    seq(`${SUPPLIER_BASE}/BRUSH/BRUSH MSDS Copy`, 8),
    seq(`${SUPPLIER_BASE}/BRUSH 2/Brushes Edited`, 7),
    seq(`${SUPPLIER_BASE}/Bottle 1/glass bottle -TDS Copy`, 2),
    seq(`${SUPPLIER_BASE}/Bottle 2/GZHL2104012131OT-bottle Copy`, 3),
    seq(`${SUPPLIER_BASE}/Bottle 3/GZHL2104012137OT Copy`, 4),
    seq(`${SUPPLIER_BASE}/Reach/REACH PP 510-NA Copy`, 15),
    seq(`${SUPPLIER_BASE}/packaging/PFAS_Information_Sheet_REDACTED`, 2),
    seq(`${SUPPLIER_BASE}/packaging/packaging`, 2),
    seq(`${SUPPLIER_BASE}/packaging/packaging section 2`, 2),
    [`${SUPPLIER_BASE}/Jars/Reach Declaration 30.7.2026 Copy.webp`],
  ];


  const faqs = [
    {
      question: 'What is the EU PPWR?',
      answer: 'The Packaging and Packaging Waste Regulation (Regulation (EU) 2025/40) is the EU framework that replaces the old Packaging and Packaging Waste Directive (94/62/EC). As a Regulation it applies directly and uniformly in every member state, harmonising rules on packaging design, recycled content, minimisation, labelling and waste management.'
    },
    {
      question: 'Does the PPWR apply to gel polish and cosmetics packaging?',
      answer: 'Yes. The PPWR covers all packaging placed on the EU market regardless of the product inside, including primary bottles and jars, secondary cartons, and transport/tertiary packaging used to ship cosmetics and gel polish.'
    },
    {
      question: 'Who is legally responsible for packaging compliance?',
      answer: 'Responsibility sits with the economic operator placing the packaged product on the market in each country — typically the brand owner or importer, who must register for Extended Producer Responsibility (EPR), pay fees and report packaging quantities. As your manufacturer, we support you with compliant packaging and documentation.'
    },
    {
      question: 'What does "recyclable by design" mean for my packaging?',
      answer: 'It means packaging must be designed so it can be effectively collected, sorted and recycled in practice — using compatible materials, avoiding problematic material combinations, and meeting recyclability performance grades. From 2030 non-recyclable packaging cannot be placed on the EU market (with limited exemptions).'
    },
    {
      question: 'How does recycled content apply to plastic components?',
      answer: 'Plastic parts of packaging (for example caps and closures) must include a minimum share of post-consumer recycled content, with targets rising over time. Requirements vary by plastic type and whether the packaging is contact-sensitive.'
    },
    {
      question: 'Do I need EPR registration in every EU country I sell to?',
      answer: 'Generally yes. Extended Producer Responsibility is administered nationally, so you must register and report in each member state where you place packaged products on the market. We can point you to the schemes and the data you need to report.'
    },
    {
      question: 'How does Leeukopf help me stay compliant?',
      answer: 'We manufacture with recyclable, low-migration and minimised packaging, provide material composition data for your labelling and EPR reporting, and align our packaging choices with the PPWR timeline so your brand is future-proof as the rules tighten.'
    }
  ];

  return (
    <PageTemplate
      title="EU Packaging Compliance (PPWR)"
      subtitle="Understand your obligations under the EU Packaging and Packaging Waste Regulation — and how Leeukopf's recyclable, minimised packaging keeps your gel polish brand market-ready."
      breadcrumbs={[
        { label: 'Home', path: '/' },
        { label: 'Packaging Compliance' }
      ]}
      showCTA={true}
      ctaText="Talk to Our Compliance Team"
      ctaLink="#packaging-consultation"
      heroImage="/img/hero/certifications-compliance-hero.jpg"
    >
      {/* Intro */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6 relative inline-block">
          What Is the EU PPWR?
          <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-primary" aria-hidden="true"></span>
        </h2>
        <p className="text-gray-600 mb-4">
          The <strong>Packaging and Packaging Waste Regulation (PPWR)</strong> is the EU's harmonised
          framework governing how packaging is designed, produced, labelled and recovered. It replaces
          the earlier Packaging and Packaging Waste Directive and, as a Regulation, applies directly in
          every EU member state — removing the patchwork of differing national rules.
        </p>
        <p className="text-gray-600">
          For cosmetics and gel polish brands, the PPWR affects every layer of packaging: the primary
          bottle or jar, the outer carton, and the transport packaging used to ship your products.
          Meeting these requirements is now a condition of placing products on the EU market.
        </p>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded mt-8 flex gap-3">
          <Info className="text-blue-600 flex-shrink-0 mt-1" size={24} />
          <p className="text-gray-700">
            <strong>Legal basis:</strong> Regulation (EU) 2025/40 on packaging and packaging waste,
            which repeals Directive 94/62/EC. Always confirm the latest thresholds and dates with an
            EU regulatory advisor, as delegated acts continue to refine specific requirements.
          </p>
        </div>
      </div>

      {/* Compliance Declarations */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6 relative inline-block">
          Our Packaging Compliance Declarations
          <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-primary" aria-hidden="true"></span>
        </h2>
        <p className="text-gray-600 mb-6 max-w-3xl">
          Leeukopf Laboratories (Thermitek Ltd) issues the following declarations confirming that our
          packaging is sourced and documented to align with EU PPWR and REACH/SVHC requirements.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {declarations.map((images) => (
            <button
              key={images[0]}
              type="button"
              onClick={() => setGallery({ images, index: 0 })}
              className="card p-0 overflow-hidden block relative border border-gray-200 hover:border-primary hover:shadow-lg transition-all cursor-pointer"
              aria-label={`Open document${images.length > 1 ? `, ${images.length} pages` : ''}`}
            >
              <img
                src={toUrl(images[0])}
                alt="Compliance document"
                loading="lazy"
                className="w-full h-auto"
              />
              {images.length > 1 && (
                <span className="absolute top-2 right-2 bg-black/70 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                  {images.length} pages
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Manufacturer & Supplier Certifications */}
        <h3 className="text-lg font-semibold text-gray-900 mt-10 mb-3">
          Manufacturer &amp; Supplier Certifications
        </h3>
        <p className="text-gray-600 mb-6 max-w-3xl">
          Supporting declarations, test reports and safety data sheets from our packaging and
          raw-material suppliers.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {supplierDocs.map((images) => (
            <button
              key={images[0]}
              type="button"
              onClick={() => setGallery({ images, index: 0 })}
              className="card p-0 overflow-hidden block relative hover:border-primary hover:shadow-lg transition-all cursor-pointer"
              aria-label={`Open document${images.length > 1 ? `, ${images.length} pages` : ''}`}
            >
              <img
                src={toUrl(images[0])}
                alt="Compliance document"
                loading="lazy"
                className="w-full h-48 object-cover object-top bg-gray-50"
              />
              {images.length > 1 && (
                <span className="absolute top-2 right-2 bg-black/70 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                  {images.length} pages
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Key Obligations */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6 relative inline-block">
          Key Packaging Obligations
          <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-primary" aria-hidden="true"></span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {obligations.map((item, index) => (
            <div key={index} className="card p-6 border-t-4 border-primary hover:shadow-lg transition-shadow">
              <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6 relative inline-block">
          Compliance Timeline
          <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-primary" aria-hidden="true"></span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-8">
          {timeline.map((phase, index) => (
            <div key={index} className="card p-6 text-center border-t-4 border-primary">
              <div className="inline-flex items-center justify-center px-4 py-1 rounded-full bg-primary text-white font-bold text-sm mb-4">
                {phase.year}
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">{phase.title}</h4>
              <p className="text-sm text-gray-600">{phase.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded mt-8 flex gap-3">
          <AlertTriangle className="text-yellow-600 flex-shrink-0 mt-1" size={24} />
          <p className="text-gray-700">
            <strong>Important:</strong> Dates and thresholds are staged and subject to delegated acts.
            Plan packaging changes early — recyclability-by-design and recycled-content rules require
            lead time to implement across your product range.
          </p>
        </div>
      </div>

      {/* Our Packaging Approach */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6 relative inline-block">
          How Leeukopf Packaging Supports Compliance
          <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-primary" aria-hidden="true"></span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <div className="card p-6 border-l-4 border-green-500">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle className="text-green-500" size={24} />
              What We Provide
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li><strong>Recyclable materials:</strong> Glass bottles and mono-material components chosen for recyclability</li>
              <li><strong>Minimised packaging:</strong> Right-sized cartons that reduce empty space and material use</li>
              <li><strong>Low-migration labels &amp; inks:</strong> Recycling-compatible labelling systems</li>
              <li><strong>Material data:</strong> Composition and weight information for your EPR reporting</li>
              <li><strong>Future-ready sourcing:</strong> Packaging aligned with the PPWR phase-in timeline</li>
            </ul>
          </div>

          <div className="card p-6 border-l-4 border-primary">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Package className="text-primary" size={24} />
              What You Handle
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li><strong>EPR registration:</strong> Register with the packaging scheme in each market you sell to</li>
              <li><strong>Reporting &amp; fees:</strong> Declare packaging quantities and pay producer responsibility fees</li>
              <li><strong>On-pack labelling:</strong> Apply harmonised sorting/disposal marks on your artwork</li>
              <li><strong>Responsible operator:</strong> Ensure a market-facing operator or importer is designated</li>
            </ul>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Recycle className="text-green-600" size={24} />
            Packaging Materials at a Glance
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {materials.map((material, index) => (
              <div key={index} className="card p-4 text-center hover:border-primary transition-colors">
                <div className="text-3xl mb-2">{material.icon}</div>
                <p className="text-sm font-semibold text-gray-700 mb-1">{material.name}</p>
                <p className="text-xs text-gray-500">{material.note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6 relative inline-block">
          Frequently Asked Questions
          <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-primary" aria-hidden="true"></span>
        </h2>

        <div className="space-y-4 mt-8">
          {faqs.map((faq, index) => (
            <div key={index} className="card p-6 border-l-4 border-primary">
              <h4 className="font-semibold text-gray-900 mb-2">{faq.question}</h4>
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div id="packaging-consultation" className="mb-10 sm:mb-12 md:mb-16">
        <div className="card p-8 text-center border-t-4 border-primary">
          <FileText className="text-primary mx-auto mb-4" size={40} />
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
            Need Help With Packaging Compliance?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            Our team can advise on recyclable packaging options, provide the material data you need for
            EPR reporting, and help align your product range with the EU PPWR timeline.
          </p>
          <a
            href="/client-registration"
            className="inline-flex items-center justify-center bg-primary text-white font-semibold px-8 py-3 rounded-full hover:opacity-90 transition-opacity"
          >
            Get in Touch
          </a>
        </div>
      </div>

      {gallery && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeGallery();
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Document viewer"
        >
          <button
            onClick={closeGallery}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Close"
          >
            <X size={32} aria-hidden="true" />
          </button>

          {gallery.images.length > 1 && (
            <>
              <button
                onClick={prevPage}
                className="absolute left-4 text-white hover:text-gray-300 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Previous page"
              >
                <ChevronLeft size={48} aria-hidden="true" />
              </button>
              <button
                onClick={nextPage}
                className="absolute right-4 text-white hover:text-gray-300 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Next page"
              >
                <ChevronRight size={48} aria-hidden="true" />
              </button>
            </>
          )}

          <div className="max-w-5xl max-h-[90vh] flex flex-col items-center">
            <img
              src={toUrl(gallery.images[gallery.index])}
              alt={`Compliance document — page ${gallery.index + 1}`}
              className="max-w-full max-h-[80vh] object-contain"
            />
            {gallery.images.length > 1 && (
              <p className="text-white text-center mt-4 text-sm text-gray-300">
                Page {gallery.index + 1} of {gallery.images.length}
              </p>
            )}
          </div>
        </div>
      )}
    </PageTemplate>
  );
}
