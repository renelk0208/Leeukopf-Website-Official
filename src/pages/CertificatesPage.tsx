import PageTemplate from '../components/PageTemplate';

export default function CertificatesPage() {
  const certificates = [
    {
      title: 'Chamber 2025 BCCI',
      image: '/certificates/Chamber 2025 BCCI-1.jpg',
      alt: 'Chamber 2025 BCCI Certificate',
      description: 'Bulgarian Chamber of Commerce and Industry membership'
    },
    {
      title: 'Free Sale Certificate 2025-2026',
      image: '/certificates/FREE SALE CERTIFICATE 2025-2026-1.jpg',
      alt: 'Free Sale Certificate 2025-2026',
      description: 'Official certification for international trade'
    },
    {
      title: 'GMP Certificate 2025-2026',
      image: '/certificates/GMP CERTIFICATE 2025-2026-1.jpg',
      alt: 'GMP Certificate 2025-2026 for Thermitek Ltd',
      description: 'Good Manufacturing Practice certification'
    },
    {
      title: 'ISO 9001 Certificate 2025-2026',
      image: '/certificates/ISO 9001 certificate 2025-2026-1.jpg',
      alt: 'ISO 9001 Certificate 2025-2026',
      description: 'Quality management system certification'
    },
    {
      title: 'Leaping Bunny Certificate 2025-26',
      image: '/certificates/Thermitek  Leaping Bunny Certificate 2025-26-1.jpg',
      alt: 'Leaping Bunny Certificate 2025-26',
      description: 'Cruelty-free certification from Leaping Bunny'
    },
    {
      title: 'BNAEQPC Membership 2025',
      image: '/certificates/bnaeqpc-membership-2025.jpg',
      alt: 'BNAEQPC Membership Certificate 2025',
      description: 'Professional association membership certificate'
    }
  ];

  return (
    <PageTemplate
      title="Certifications & Compliance"
      subtitle="Ensuring trust, safety and global regulatory alignment."
      breadcrumbs={[
        { label: 'Home', path: '/' },
        { label: 'Certifications & Compliance' }
      ]}
      showCTA={true}
      ctaText="Request Documentation"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {certificates.map((cert) => (
            <div 
              key={cert.title} 
              className="bg-white rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.08)] p-6 md:p-7 hover:shadow-[0_6px_16px_rgba(0,0,0,0.12)] transition-shadow duration-300"
            >
              <div className="flex flex-col items-center">
                <div className="w-full mb-5">
                  <img
                    src={cert.image}
                    alt={cert.alt}
                    className="w-full h-auto rounded-md"
                  />
                </div>
                <div className="w-full border-t border-gray-200 pt-5 text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {cert.title}
                  </h3>
                  <p className="text-sm text-gray-600 font-light">
                    {cert.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.08)] p-6 md:p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Documentation & Compliance
          </h2>
          <p className="text-gray-600 font-light leading-relaxed">
            For full access to our certification documents, safety data sheets (SDS), product information files (PIF), 
            or certificates of analysis (COA), please contact us directly. We provide complete documentation to verified 
            business partners and distributors to ensure compliance with all regulatory requirements.
          </p>
        </div>
      </div>
    </PageTemplate>
  );
}
