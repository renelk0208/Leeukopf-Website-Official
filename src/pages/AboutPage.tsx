import PageTemplate, { ImagePlaceholder } from '../components/PageTemplate';

export default function AboutPage() {
  return (
    <PageTemplate
      title="About Leeukopf Laboratories"
      subtitle="Premium beauty solutions manufactured in Bulgaria, trusted by professionals worldwide."
      breadcrumbs={[
        { label: 'Home', path: '/' },
        { label: 'About' }
      ]}
      showCTA={true}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Our Story</h2>
          <p className="text-gray-600 mb-4 font-light leading-relaxed">
            Founded with a commitment to excellence, Leeukopf Laboratories has become a trusted name in professional beauty products. Our state-of-the-art manufacturing facility in Bulgaria combines European quality standards with innovative formulations to deliver products that meet the highest industry benchmarks.
          </p>
          <p className="text-gray-600 font-light leading-relaxed">
            We specialize in gel polish systems, builder gels, acrylics, and complete nail care solutions. Every product is developed with meticulous attention to detail, ensuring safety, performance, and stunning results for nail professionals and their clients worldwide.
          </p>
        </div>
        <div>
          <ImagePlaceholder alt="Leeukopf Laboratory facility" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <div>
          <ImagePlaceholder alt="Manufacturing process" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Quality & Compliance</h2>
          <p className="text-gray-600 mb-4 font-light leading-relaxed">
            Our products are manufactured under strict GMP guidelines and comply with EU Regulation 1223/2009. We maintain comprehensive Safety Data Sheets and Product Information Files for all formulations. Every batch undergoes rigorous testing to ensure consistency and safety.
          </p>
          <p className="text-gray-600 font-light leading-relaxed">
            We are proud to be cruelty-free certified and committed to ethical manufacturing practices. Our formulations are TPO-free, HEMA-free where specified, and many products carry vegan certification, reflecting our dedication to both quality and responsibility.
          </p>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Why Choose Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">EU</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">European Standards</h3>
            <p className="text-sm text-gray-600 font-light">Full compliance with EU cosmetics regulations</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">GMP</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">GMP Certified</h3>
            <p className="text-sm text-gray-600 font-light">Manufactured under Good Manufacturing Practices</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🐰</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Cruelty-Free</h3>
            <p className="text-sm text-gray-600 font-light">Never tested on animals, certified ethical</p>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
}
