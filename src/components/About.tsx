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
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 md:p-12 shadow-sm">
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
      </div>
    </section>
  );
}
