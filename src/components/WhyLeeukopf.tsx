import { CheckCircle2 } from 'lucide-react';

export default function WhyLeeukopf() {
  const benefits = [
    'Over 3,000 colours available for full customisation of your private label line.',
    'A step-by-step Private Label Process that makes brand creation simple and guided.',
    'All products developed under Good Manufacturing Practice (GMP) standards.',
    'Registered through the European CPNP Portal for full regulatory compliance.',
    'Supported by complete Medical Safety Data Sheets (MSDS) and product documentation.',
    'Leaping Bunny Cruelty-Free approved — proof of ethical, animal-friendly production.',
    'Certified with Free Sale Certificates for smooth international export.',
    'Proud member of the Bulgarian Cosmetics Association, recognised within the EU industry.',
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Responsive heading */}
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Why Leeukopf Laboratories?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-2">
            When you choose Leeukopf Laboratories, you're not just choosing a manufacturer — you're choosing a partner invested in your brand's success.
          </p>
        </div>

        {/* Responsive benefits grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="flex items-start gap-3 sm:gap-4 p-4 sm:p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{benefit}</p>
            </div>
          ))}
        </div>

        {/* Responsive CTA text */}
        <div className="text-center">
          <p className="text-base sm:text-lg text-gray-800 font-medium max-w-4xl mx-auto px-2">
            A trusted partner that combines expertise, ethics, and innovation to help your brand stand out in the global market.
          </p>
        </div>
      </div>
    </section>
  );
}
