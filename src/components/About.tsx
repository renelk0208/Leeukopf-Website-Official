export default function About() {
  return (
    <section id="about" className="py-12 sm:py-16 md:py-20 bg-white/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Responsive heading and text */}
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 tracking-tight">
            Who We Are
          </h2>
          <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-light px-2">
            Leeukopf Laboratories is a leading cosmetics and private label brand company based in Bulgaria,
            providing exceptional support throughout the process of creating your Private Label Brand
          </p>
        </div>

        {/* Responsive content card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 md:p-12 shadow-sm mb-8 sm:mb-12">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-4 sm:mb-6">
              Our Mission
            </h3>
            <p className="text-gray-600 leading-relaxed text-base sm:text-lg font-light mb-4 sm:mb-6">
              At Thermitek Ltd and Leeukopf Laboratories, we're here to make creating your Private Label Brand feel exciting — not overwhelming.
              From your first idea to your finished product, you'll have real people guiding you every step of the way.
              Our trained consultants take the time to understand your vision, answer your questions, and help you make the right choices along the way.
              We believe in keeping things simple, transparent, and personal — you'll never be left guessing what comes next.
            </p>
            <p className="text-gray-600 leading-relaxed text-base sm:text-lg font-light mb-3 sm:mb-4">
              During your consultation, we'll cover everything that matters:
            </p>
            {/* Responsive bullet list */}
            <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
              <div className="flex items-start space-x-3">
                <div className="mt-1.5 w-2 h-2 bg-blue-800 rounded-full flex-shrink-0"></div>
                <p className="text-gray-700 text-sm sm:text-base">Choosing the right stock</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="mt-1.5 w-2 h-2 bg-blue-800 rounded-full flex-shrink-0"></div>
                <p className="text-gray-700 text-sm sm:text-base">Selecting colours that match your brand identity</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="mt-1.5 w-2 h-2 bg-blue-800 rounded-full flex-shrink-0"></div>
                <p className="text-gray-700 text-sm sm:text-base">Picking bottles and packaging</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="mt-1.5 w-2 h-2 bg-blue-800 rounded-full flex-shrink-0"></div>
                <p className="text-gray-700 text-sm sm:text-base">Setting you up for confident global growth</p>
              </div>
            </div>
            <p className="text-gray-600 leading-relaxed text-base sm:text-lg font-light">
              We love seeing ideas turn into brands — and we'd love to help you build yours with skill, integrity, and genuine support from start to finish.
            </p>
          </div>
        </div>

        {/* Why Choose Leeukopf Section */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 md:p-12 shadow-sm mb-8 sm:mb-12">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-6 sm:mb-8 text-center">
              Why Choose Leeukopf Laboratories?
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                    <strong>🏭 State-of-the-Art Manufacturing</strong>
                  </h4>
                  <p className="text-gray-600 leading-relaxed text-sm sm:text-base font-light">
                    Our certified factory in Blagoevgrad, Bulgaria uses cutting-edge technology and adheres to the highest international quality standards. We manufacture premium gel polish, builder gels, and professional nail care products with precision.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                    <strong>🎨 2000+ Premium Colors</strong>
                  </h4>
                  <p className="text-gray-600 leading-relaxed text-sm sm:text-base font-light">
                    Choose from our extensive collection of over 2000 vibrant gel polish colors. From timeless classics to trendy seasonal shades, find the perfect colors for your brand.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                    <strong>✅ HEMA-Free Formulations</strong>
                  </h4>
                  <p className="text-gray-600 leading-relaxed text-sm sm:text-base font-light">
                    We prioritize safety with our HEMA-free gel polish formulations. Our products are gentler on nails while maintaining professional-grade quality and brilliant shine.
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                    <strong>🌍 Global Distribution Network</strong>
                  </h4>
                  <p className="text-gray-600 leading-relaxed text-sm sm:text-base font-light">
                    We partner with distributors and private label clients worldwide. Our experienced logistics team ensures reliable delivery and seamless international shipping to help your brand succeed.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                    <strong>📜 Certified & Compliant</strong>
                  </h4>
                  <p className="text-gray-600 leading-relaxed text-sm sm:text-base font-light">
                    All our products meet EU cosmetics regulations and international safety standards. We provide complete documentation and certificates to ensure your brand complies with regulations.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                    <strong>🤝 Personalized Consultation & Support</strong>
                  </h4>
                  <p className="text-gray-600 leading-relaxed text-sm sm:text-base font-light">
                    Unlike large manufacturers, we offer dedicated one-on-one support. Our expert consultants guide you through every step of launching and growing your private label nail care brand.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Our Services Section */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 md:p-12 shadow-sm">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-6 sm:mb-8 text-center">
              Comprehensive Private Label Services
            </h3>
            
            <div className="space-y-6">
              <div className="border-l-4 border-blue-800 pl-4 sm:pl-6">
                <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                  Private Label Gel Polish Manufacturing
                </h4>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base font-light">
                  Create your own branded gel polish line with our comprehensive private label service. We offer custom color development, 
                  bottle selection, label design support, and complete production management. Whether you need 100 bottles or 100,000, 
                  we scale to meet your business needs.
                </p>
              </div>
              
              <div className="border-l-4 border-blue-800 pl-4 sm:pl-6">
                <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                  Builder Gel & Professional Systems
                </h4>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base font-light">
                  Expand your product line with professional builder gels, rubber bases, top coats, and complete gel systems. 
                  Our builder gels offer superior strength and flexibility, perfect for nail extensions and overlays. All products 
                  are formulated for professional salon use with excellent workability and curing properties.
                </p>
              </div>
              
              <div className="border-l-4 border-blue-800 pl-4 sm:pl-6">
                <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                  Custom Packaging & Branding
                </h4>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base font-light">
                  Make your brand stand out with custom packaging solutions. We offer various bottle styles, cap options, and label printing. 
                  Our design team can help create professional labels that reflect your brand identity and appeal to your target market.
                </p>
              </div>
              
              <div className="border-l-4 border-blue-800 pl-4 sm:pl-6">
                <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                  Quality Assurance & Testing
                </h4>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base font-light">
                  Every batch undergoes rigorous quality control testing to ensure consistency in color, viscosity, curing time, and wear. 
                  We provide full documentation including safety data sheets, ingredient lists, and certificates of analysis for complete transparency and compliance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
