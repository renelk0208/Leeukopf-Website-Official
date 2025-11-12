export default function About() {
  const certifications = [
    {
      logo: '/572916675_122131040858961647_8170659271303111919_n.jpg',
      title: 'Leaping Bunny Certified',
      description: 'Cruelty-free approval ensuring no animal testing',
      isFullImage: true
    },
    {
      logo: '/png-transparent-gmp-logo-good-manufacturing-practice-logo-certification-good-manufacturing-practice-text-monochrome-quality-removebg-preview.png',
      title: 'GMP Certified',
      description: 'Good Manufacturing Practice certified facilities',
      isFullImage: false
    },
    {
      logo: '/572916675_122131040858961647_8170659271303111919_n.jpg',
      title: 'HEMA & TPO Free',
      description: 'Safe formulations without harmful chemicals',
      isFullImage: true
    },
  ];

  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Who We Are
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
            Leeukopf Laboratories is a leading cosmetics and private label brand company based in Bulgaria,
            providing exceptional support throughout the process of creating your Private Label Brand
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {certifications.map((cert, index) => (
            <div
              key={index}
              className="group p-8 bg-white rounded-xl border-2 border-gray-200 hover:border-blue-600 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1"
            >
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-32 h-32 flex items-center justify-center">
                  <img
                    src={cert.logo}
                    alt={cert.title}
                    className="w-full h-full object-contain"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-800 transition-colors">
                  {cert.title}
                </h3>
                <p className="text-gray-600 leading-relaxed font-light">
                  {cert.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-12 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-gray-900 tracking-tight">
                Your Partner in Brand Excellence
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg font-light">
                With over 4000 color options and comprehensive support, we help you create unique private label brands
                that stand out in the market. Our personalized consulting guides you through every step of the brand
                development process.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="mt-1.5 w-2 h-2 bg-blue-800 rounded-full flex-shrink-0"></div>
                  <p className="text-gray-700">Complete product line development</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="mt-1.5 w-2 h-2 bg-blue-800 rounded-full flex-shrink-0"></div>
                  <p className="text-gray-700">Custom formulation services</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="mt-1.5 w-2 h-2 bg-blue-800 rounded-full flex-shrink-0"></div>
                  <p className="text-gray-700">Packaging and branding solutions</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="mt-1.5 w-2 h-2 bg-blue-800 rounded-full flex-shrink-0"></div>
                  <p className="text-gray-700">International compliance and certification</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">4000+</div>
                <div className="text-gray-600 font-light">Color Options Available</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">5+</div>
                <div className="text-gray-600 font-light">Product Categories</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">100%</div>
                <div className="text-gray-600 font-light">Cruelty-Free Products</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">GMP</div>
                <div className="text-gray-600 font-light">Certified Facility</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
