export default function SocialProof() {
  const countries = [
    'Belgium',
    'Bulgaria',
    'Croatia',
    'Cyprus',
    'Denmark',
    'France',
    'Greece',
    'Holland',
    'Israel',
    'Italy',
    'Moldova',
    'New Zealand',
    'Qatar',
    'Kingdom of Saudi Arabia',
    'Serbia',
    'South Africa',
    'United Kingdom',
  ];

  return (
    <section className="py-8 sm:py-12 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
            Trusted by Brands in 17+ Countries
          </h2>
          <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 text-sm sm:text-base md:text-lg text-gray-600 font-light">
            {countries.map((country, index) => (
              <span key={country} className="inline-flex items-center">
                {country}
                {index < countries.length - 1 && (
                  <span className="mx-2 text-primary font-bold">•</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
