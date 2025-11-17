import PageTemplate from '../components/PageTemplate';
import { FileText, ShieldCheck, Leaf, Award } from 'lucide-react';

export default function CertificatesPage() {
  const certifications = [
    {
      icon: ShieldCheck,
      title: 'GMP Certified',
      description: 'Our facility operates under Good Manufacturing Practice guidelines, ensuring consistent quality and safety in every batch we produce.'
    },
    {
      icon: Award,
      title: 'Leaping Bunny Certified',
      description: 'Cruelty-free certification from a globally recognized organization. No animal testing at any stage of production.'
    },
    {
      icon: FileText,
      title: 'EU 1223/2009 Compliant',
      description: 'Full compliance with European Union cosmetics regulations. All products meet strict safety and quality standards.'
    },
    {
      icon: Leaf,
      title: 'Vegan Options Available',
      description: 'Many of our products carry vegan certification, formulated without any animal-derived ingredients.'
    }
  ];

  const certificates = [
    {
      title: 'GMP Certificate 2025-2026',
      image: '/certificates/gmp-certificate-2025-2026.jpg',
      alt: 'GMP Certificate for Thermitek Ltd'
    },
    {
      title: 'Leaping Bunny Certificate 2024-25',
      image: '/certificates/leaping-bunny-2024-25.jpg',
      alt: 'Cruelty Free Leaping Bunny Certificate for Thermitek Ltd'
    },
    {
      title: 'Leaping Bunny Certificate 2023-24',
      image: '/certificates/leaping-bunny-2023-24.jpg',
      alt: 'Cruelty Free Leaping Bunny Certificate for Thermitek Ltd'
    },
    {
      title: 'Leaping Bunny Certificate 2022-23',
      image: '/certificates/leaping-bunny-2022-23.jpg',
      alt: 'Cruelty Free Leaping Bunny Certificate for Thermitek Ltd'
    },
    {
      title: 'Leaping Bunny Certificate 2021-22',
      image: '/certificates/leaping-bunny-2021-22.jpg',
      alt: 'Cruelty Free Leaping Bunny Certificate for Thermitek Ltd'
    }
  ];

  return (
    <PageTemplate
      title="Certificates & Compliance"
      subtitle="Quality, safety, and ethical manufacturing at the heart of everything we do."
      breadcrumbs={[
        { label: 'Home', path: '/' },
        { label: 'Certificates & Compliance' }
      ]}
      showCTA={true}
      ctaText="Request Documentation"
    >
      <div className="mb-16 bg-white rounded-xl p-8 flex items-center justify-center">
        <img
          src="/572916675_122131040858961647_8170659271303111919_n.jpg"
          alt="Leeukopf Laboratories Certifications - ISO 22716, ISO 9001, GMP, cPNP, FDA, MSDS, BNAF, Cruelty Free, HEMA & TPO Free"
          className="max-w-full h-auto rounded-lg"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {certifications.map((cert) => {
          const Icon = cert.icon;
          return (
            <div key={cert.title} className="p-6 bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Icon size={24} className="text-blue-800" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{cert.title}</h3>
                  <p className="text-gray-600 font-light leading-relaxed">{cert.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-gray-50 rounded-lg p-8 border border-gray-200 mb-16">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">View Our Certificates</h2>
        <p className="text-gray-600 font-light mb-8">
          Our official certification documents demonstrating our commitment to quality, safety, and ethical manufacturing practices.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => (
            <div key={cert.title} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative group">
                <img
                  src={cert.image}
                  alt={cert.alt}
                  className="w-full h-auto blur-sm group-hover:blur-md transition-all duration-300"
                  style={{ filter: 'blur(4px)' }}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300">
                  <p className="text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-60 px-4 py-2 rounded-md">
                    Preview Only
                  </p>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 text-sm">{cert.title}</h3>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 p-6 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-600 font-light text-sm">
            For full access to our certification documents, safety data sheets (SDS), product information files (PIF), or certificates of analysis (COA), please contact us directly. We provide complete documentation to verified business partners and distributors.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Product Safety Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-1 mr-3">
              <span className="text-green-600 text-sm">✓</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">TPO-Free Formulations</h3>
              <p className="text-gray-600 font-light text-sm">No triphenyl phosphate, prioritizing user safety and health.</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-1 mr-3">
              <span className="text-green-600 text-sm">✓</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">HEMA-Free Options</h3>
              <p className="text-gray-600 font-light text-sm">Specialized products available without hydroxyethyl methacrylate for sensitive users.</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-1 mr-3">
              <span className="text-green-600 text-sm">✓</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Dermatologically Tested</h3>
              <p className="text-gray-600 font-light text-sm">Products tested for skin compatibility and safety.</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-1 mr-3">
              <span className="text-green-600 text-sm">✓</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Long Shelf Life</h3>
              <p className="text-gray-600 font-light text-sm">Stable formulations with documented shelf life and storage requirements.</p>
            </div>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
}
