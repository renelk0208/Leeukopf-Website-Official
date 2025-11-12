import { Award, Shield, Globe, FileCheck, Heart, Building2 } from 'lucide-react';

export default function About() {
  const certifications = [
    {
      icon: <Heart className="text-cyan-400" size={40} />,
      title: 'Leaping Bunny Certified',
      description: 'Cruelty-free approval ensuring no animal testing',
    },
    {
      icon: <Shield className="text-cyan-400" size={40} />,
      title: 'Good Manufacturing Practice',
      description: 'GMP certified production facilities',
    },
    {
      icon: <FileCheck className="text-cyan-400" size={40} />,
      title: 'Medical Data Safety Sheets',
      description: 'Complete safety documentation for all products',
    },
    {
      icon: <Globe className="text-cyan-400" size={40} />,
      title: 'Free Sale Certification',
      description: 'Certified for export to multiple countries',
    },
    {
      icon: <Building2 className="text-cyan-400" size={40} />,
      title: 'BCA Member',
      description: 'Bulgaria Cosmetics Association member',
    },
    {
      icon: <Award className="text-cyan-400" size={40} />,
      title: 'Private Label Excellence',
      description: 'Expert support for your brand development',
    },
  ];

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Who <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">We Are</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Leeukopf Laboratories is a leading cosmetics and private label brand company based in Bulgaria,
            providing exceptional support throughout the process of creating your Private Label Brand
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {certifications.map((cert, index) => (
            <div
              key={index}
              className="group p-6 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-cyan-500/20 hover:border-cyan-400/40 transition-all transform hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/20"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-4 bg-slate-900/50 rounded-lg group-hover:bg-cyan-500/10 transition-colors">
                  {cert.icon}
                </div>
                <h3 className="text-xl font-semibold text-white group-hover:text-cyan-400 transition-colors">
                  {cert.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {cert.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-cyan-500/20 p-8 sm:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-white">
                Your Partner in <span className="text-cyan-400">Brand Excellence</span>
              </h3>
              <p className="text-gray-300 leading-relaxed text-lg">
                With over 2000 color options and comprehensive support, we help you create unique private label brands
                that stand out in the market. Our personalized consulting guides you through every step of the brand
                development process.
              </p>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="mt-1 p-1 bg-cyan-500/20 rounded">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  </div>
                  <p className="text-gray-300">Complete product line development</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="mt-1 p-1 bg-cyan-500/20 rounded">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  </div>
                  <p className="text-gray-300">Custom formulation services</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="mt-1 p-1 bg-cyan-500/20 rounded">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  </div>
                  <p className="text-gray-300">Packaging and branding solutions</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="mt-1 p-1 bg-cyan-500/20 rounded">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  </div>
                  <p className="text-gray-300">International compliance and certification</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-sm rounded-xl p-6 border border-cyan-500/30">
                <div className="text-4xl font-bold text-cyan-400 mb-2">2000+</div>
                <div className="text-gray-300">Color Options Available</div>
              </div>
              <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-sm rounded-xl p-6 border border-cyan-500/30">
                <div className="text-4xl font-bold text-cyan-400 mb-2">5+</div>
                <div className="text-gray-300">Product Categories</div>
              </div>
              <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-sm rounded-xl p-6 border border-cyan-500/30">
                <div className="text-4xl font-bold text-cyan-400 mb-2">100%</div>
                <div className="text-gray-300">Cruelty-Free Products</div>
              </div>
              <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-sm rounded-xl p-6 border border-cyan-500/30">
                <div className="text-4xl font-bold text-cyan-400 mb-2">GMP</div>
                <div className="text-gray-300">Certified Facility</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
