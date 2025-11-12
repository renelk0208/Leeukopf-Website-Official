import { ArrowRight, CheckCircle } from 'lucide-react';

export default function CertificatesBanner() {
  const badges = [
    { label: 'GMP', verified: true },
    { label: 'EU 1223/2009', verified: true },
    { label: 'Leaping Bunny', verified: true },
    { label: 'TPO/HEMA-Free', verified: true },
  ];

  return (
    <section className="border-t border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="group cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 rounded-lg p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h3 className="text-3xl font-bold text-gray-900 tracking-tight">
                Certified. Compliant.{' '}
                <span className="relative inline-block">
                  Trusted.
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-primary-500/30"></span>
                </span>
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed font-light">
                GMP manufacturing, EU 1223/2009 compliance, Leaping Bunny approval, and TPO/HEMA-free systems.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex flex-wrap gap-3">
                {badges.map((badge, index) => (
                  <div
                    key={index}
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-full hover:border-primary-300 transition-colors"
                  >
                    <CheckCircle size={16} className="text-primary-500" />
                    <span className="text-sm font-medium text-gray-700">{badge.label}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  window.location.href = '/certificates-and-compliance';
                }}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gray-900 text-white rounded-md font-semibold hover:bg-gray-800 transition-all duration-300 shadow-sm hover:shadow-md w-full lg:w-auto justify-center lg:justify-start"
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
