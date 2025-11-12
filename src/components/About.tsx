export default function About() {
  const certifications = [
    {
      logo: '/572916675_122131040858961647_8170659271303111919_n.jpg',
      title: 'Leaping Bunny Certified',
      description: 'Cruelty-free approval ensuring no animal testing',
      isFullImage: true
    },
    {
      logo: '/img/certifications/gmp-certified.png',
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
                    alt={cert.title === 'GMP Certified' ? 'GMP Certified.' : cert.title}
                    className={cert.title === 'GMP Certified'
                      ? 'max-h-[28px] sm:max-h-[36px] w-auto object-contain'
                      : 'w-full h-full object-contain'}
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
                Our Mission
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg font-light">
                At Thermitek Ltd and Leeukopf Laboratories, we're here to make creating your Private Label Brand feel exciting — not overwhelming.
                From your first idea to your finished product, you'll have real people guiding you every step of the way.
                Our trained consultants take the time to understand your vision, answer your questions, and help you make the right choices along the way.
                We believe in keeping things simple, transparent, and personal — you'll never be left guessing what comes next.
              </p>
              <p className="text-gray-600 leading-relaxed text-lg font-light">
                During your consultation, we'll cover everything that matters:
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="mt-1.5 w-2 h-2 bg-blue-800 rounded-full flex-shrink-0"></div>
                  <p className="text-gray-700">Choosing the right stock</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="mt-1.5 w-2 h-2 bg-blue-800 rounded-full flex-shrink-0"></div>
                  <p className="text-gray-700">Selecting colours that match your brand identity</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="mt-1.5 w-2 h-2 bg-blue-800 rounded-full flex-shrink-0"></div>
                  <p className="text-gray-700">Picking bottles and packaging</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="mt-1.5 w-2 h-2 bg-blue-800 rounded-full flex-shrink-0"></div>
                  <p className="text-gray-700">Setting you up for confident global growth</p>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg font-light">
                We love seeing ideas turn into brands — and we'd love to help you build yours with skill, integrity, and genuine support from start to finish.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">3000+</div>
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
