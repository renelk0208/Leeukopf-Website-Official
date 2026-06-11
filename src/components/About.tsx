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
            providing exceptional support throughout the process of creating your Private Label Brand.
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
            </div>
          </div>
        </div>

        {/* Science & Manufacturing Excellence */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 md:p-12 shadow-sm mb-8 sm:mb-12">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-4 sm:mb-6">
              Science & Manufacturing Excellence
            </h3>
            <p className="text-gray-600 leading-relaxed text-base sm:text-lg font-light">
              Our state-of-the-art facilities combine advanced manufacturing processes with rigorous quality control. 
              Every product is crafted with precision, backed by certified safety standards and scientific innovation.
            </p>
          </div>
        </div>

        {/* Shade Innovation & Luxury Branding */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 md:p-12 shadow-sm mb-8 sm:mb-12">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-4 sm:mb-6">
              Shade Innovation & Luxury Branding
            </h3>
            <p className="text-gray-600 leading-relaxed text-base sm:text-lg font-light">
              We offer an extensive palette of over 2000 unique shades, designed to elevate your brand identity. 
              From timeless classics to trending colors, our formulations deliver vibrant, long-lasting results that define luxury.
            </p>
          </div>
        </div>

        {/* Partnership & Reliability */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 md:p-12 shadow-sm mb-8 sm:mb-12">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-4 sm:mb-6">
              Partnership & Reliability
            </h3>
            <p className="text-gray-600 leading-relaxed text-base sm:text-lg font-light">
              We're more than a supplier — we're your trusted partner in building a successful brand. 
              With transparent communication, consistent quality, and on-time delivery, we ensure your business thrives.
            </p>
          </div>
        </div>

        {/* Certifications Section */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 md:p-12 shadow-sm mb-8 sm:mb-12">
          <div className="text-center">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-4">
              Certifications
            </h3>
            <p className="text-gray-600 text-base sm:text-lg font-light mb-6">
              Recognized for our commitment to quality and excellence.
            </p>
            {/* Certification icons grid */}
            <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 mb-6">
              <img src="/img/certifications/gmp-icon.png" alt="GMP Certified - Good Manufacturing Practice" className="w-20 h-20 sm:w-24 sm:h-24 object-contain" />
              <img src="/img/certifications/iso-9001-icon.png" alt="ISO 9001 Certified - Quality Management System" className="w-20 h-20 sm:w-24 sm:h-24 object-contain" />
              <img src="/img/certifications/fda-registered-icon.png" alt="FDA Registered - U.S. Food and Drug Administration" className="w-20 h-20 sm:w-24 sm:h-24 object-contain" />
              <img src="/img/certifications/sfda-icon.png" alt="SFDA Approved - Saudi Food and Drug Authority" className="w-20 h-20 sm:w-24 sm:h-24 object-contain" />
              <img src="/img/certifications/tuv-austria-icon.png" alt="TÜV Austria Certified - Technical Inspection Association" className="w-20 h-20 sm:w-24 sm:h-24 object-contain" />
              <img src="/img/certifications/bnae-icon.png" alt="BNAE Certified - Bulgarian National Association of Exporters" className="w-20 h-20 sm:w-24 sm:h-24 object-contain" />
              <img src="/img/certifications/bulgarian-chamber-industry-commerce-icon.png" alt="Bulgarian Chamber of Commerce and Industry Member" className="w-20 h-20 sm:w-24 sm:h-24 object-contain" />
            </div>
            {/* Compliance microcopy */}
            <p className="text-gray-600 text-sm sm:text-base font-light max-w-3xl mx-auto leading-relaxed">
              We support manufacturing documentation and EU readiness (CPNP pathway). Brand owners remain responsible for final labels, claims, and local Responsible Person requirements where applicable.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}