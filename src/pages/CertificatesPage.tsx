import PageTemplate, { ImagePlaceholder } from '../components/PageTemplate';
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
      <div className="mb-16 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-8 flex items-center justify-center">
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
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Icon size={24} className="text-primary-600" />
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
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Available Documentation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">Safety Data Sheets (SDS)</h3>
            <p className="text-gray-600 font-light text-sm mb-4">Comprehensive safety information for all products, including handling, storage, and emergency procedures.</p>
            <button className="text-primary-600 hover:text-primary-700 font-semibold text-sm">
              Download SDS →
            </button>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">Product Information Files (PIF)</h3>
            <p className="text-gray-600 font-light text-sm mb-4">Detailed formulation data, stability testing, and compliance documentation for regulatory requirements.</p>
            <button className="text-primary-600 hover:text-primary-700 font-semibold text-sm">
              Request PIF →
            </button>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">Certificates of Analysis</h3>
            <p className="text-gray-600 font-light text-sm mb-4">Batch-specific testing results confirming product specifications and quality standards.</p>
            <button className="text-primary-600 hover:text-primary-700 font-semibold text-sm">
              Request COA →
            </button>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">Certification Documents</h3>
            <p className="text-gray-600 font-light text-sm mb-4">Official certificates for GMP, cruelty-free status, and other compliance documentation.</p>
            <button className="text-primary-600 hover:text-primary-700 font-semibold text-sm">
              View Certificates →
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Product Safety Features</h2>
          <div className="space-y-4">
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
        <div>
          <ImagePlaceholder alt="Quality control laboratory" />
        </div>
      </div>
    </PageTemplate>
  );
}
