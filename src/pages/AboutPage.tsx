import PageTemplate from '../components/PageTemplate';
import FacilityCarousel from '../components/FacilityCarousel';
import WhyLeeukopf from '../components/WhyLeeukopf';

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
      {/* Responsive intro section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 mb-10 sm:mb-12 md:mb-16">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">Our Story</h2>
          <p className="text-gray-600 mb-4 font-light leading-relaxed text-sm sm:text-base">
            Founded with a commitment to excellence, Leeukopf Laboratories has become a trusted name in professional beauty products. Our state-of-the-art manufacturing facility in Bulgaria combines European quality standards with innovative formulations to deliver products that meet the highest industry benchmarks.
          </p>
          <p className="text-gray-600 font-light leading-relaxed text-sm sm:text-base">
            We specialize in gel polish systems, builder gels, acrylics, and complete nail care solutions. Every product is developed with meticulous attention to detail, ensuring safety, performance, and stunning results for nail professionals and their clients worldwide.
          </p>
        </div>
        <div className="relative overflow-hidden rounded-lg">
          <img
            src="/img/factory/Firefly_Gemini Flash_create an image of Leeukopf Laboratory facility - factory about 1500 sqaure meters, d 93539.png"
            alt="Leeukopf Laboratories — Manufacturing Facility"
            className="w-full h-full object-cover object-center aspect-[16/9] lg:aspect-[4/3]"
            loading="lazy"
          />
          <p className="text-xs text-gray-500 mt-2 text-center font-light">
            Leeukopf Laboratories — Manufacturing Facility
          </p>
        </div>
      </div>

      {/* Responsive Quality & Compliance */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">Quality & Compliance</h2>
        <p className="text-gray-600 mb-4 font-light leading-relaxed text-sm sm:text-base">
          Our products are manufactured under strict GMP guidelines and comply with EU Regulation 1223/2009. We maintain comprehensive Safety Data Sheets and Product Information Files for all formulations. Every batch undergoes rigorous testing to ensure consistency and safety.
        </p>
        <p className="text-gray-600 font-light leading-relaxed text-sm sm:text-base">
          We are proud to be cruelty-free certified and committed to ethical manufacturing practices. Our formulations are TPO-free, HEMA-free where specified, and many products carry vegan certification, reflecting our dedication to both quality and responsibility.
        </p>
      </div>

      {/* Responsive Manufacturing Process */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 tracking-tight">
            Manufacturing Process
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto font-light px-2">
            From raw materials to finished product, every step is carefully controlled to ensure the highest quality
          </p>
        </div>
        {/* Responsive grid for manufacturing steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            <img
              src="/Raw Materials Intake.png"
              alt="Raw Materials & QC Intake"
              className="w-full h-36 sm:h-48 object-cover"
              loading="lazy"
            />
            <div className="p-4 sm:p-6">
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-800 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0">
                  1
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Raw Materials & QC Intake</h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 font-light leading-relaxed">
                All incoming materials undergo rigorous quality control testing to ensure they meet our strict standards.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            <img
              src="/img/factory/Leeukopf Factory (4).png"
              alt="Formulation & Mixing"
              className="w-full h-36 sm:h-48 object-cover"
              loading="lazy"
            />
            <div className="p-4 sm:p-6">
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-800 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0">
                  2
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Formulation & Mixing</h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 font-light leading-relaxed">
                Precise formulations are mixed in controlled environments to achieve perfect consistency and color accuracy.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            <img
              src="/Labelling and Packaging.png"
              alt="Filling & Capping"
              className="w-full h-36 sm:h-48 object-cover"
              loading="lazy"
            />
            <div className="p-4 sm:p-6">
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-800 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0">
                  3
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Filling & Capping</h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 font-light leading-relaxed">
                Automated filling systems ensure precise volumes and contamination-free bottling of every product.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            <img
              src="/Labelling.png"
              alt="Label & Batch Coding"
              className="w-full h-36 sm:h-48 object-cover"
              loading="lazy"
            />
            <div className="p-4 sm:p-6">
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-800 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0">
                  4
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Label & Batch Coding</h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 font-light leading-relaxed">
                Each product receives accurate labeling and batch codes for full traceability throughout the supply chain.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            <img
              src="/Final QC.png"
              alt="Final QA & Packing"
              className="w-full h-36 sm:h-48 object-cover"
              loading="lazy"
            />
            <div className="p-4 sm:p-6">
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-800 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0">
                  5
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Final QA & Packing</h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 font-light leading-relaxed">
                Final quality checks confirm product excellence before secure packaging and shipment to customers worldwide.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive Facility section */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 tracking-tight">
            Our Facility
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto font-light px-2">
            Take a look inside our state-of-the-art manufacturing facility and see how we bring innovation and quality to every product
          </p>
        </div>
        <FacilityCarousel />
      </div>

      <WhyLeeukopf />
    </PageTemplate>
  );
}
