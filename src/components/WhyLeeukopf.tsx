import { CheckCircle2 } from 'lucide-react';

export default function WhyLeeukopf() {
  const benefits = [
    'Over 2,000 colours available for full customisation of your private label line.',
    'A step-by-step Private Label Process that makes brand creation simple and guided.',
    'All products developed under Good Manufacturing Practice (GMP) standards.',
    'Registered through the European CPNP Portal for full regulatory compliance.',
    'Supported by complete Medical Safety Data Sheets (MSDS) and product documentation.',
    'Leaping Bunny Cruelty-Free approved — proof of ethical, animal-friendly production.',
    'Certified with Free Sale Certificates for smooth international export.',
    'Proud member of the Bulgarian Cosmetics Association, recognised within the EU industry.',
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Leeukopf Laboratories?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            When you choose Leeukopf Laboratories, you're not just choosing a manufacturer — you're choosing a partner invested in your brand's success.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <p className="text-gray-700 leading-relaxed">{benefit}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-lg text-gray-800 font-medium max-w-4xl mx-auto">
            A trusted partner that combines expertise, ethics, and innovation to help your brand stand out in the global market.
          </p>
        </div>
      </div>
    </section>
  );
}
