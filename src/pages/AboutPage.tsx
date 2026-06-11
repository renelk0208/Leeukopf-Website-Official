import PageTemplate from '../components/PageTemplate';
import StartHereBanner from '../components/StartHereBanner';
import WhyChooseLeeukopf from '../components/WhyChooseLeeukopf';
import OptimizedImage from '../components/OptimizedImage';
import VideoGallery from '../components/VideoGallery';
import { RESPONSIVE_SIZES } from '../lib/responsive-sizes';

export default function AboutPage() {
  // Pigment mixing videos - all available videos from the factory
  // Full collection of pigment mixing process videos - 16 videos total
  const pigmentMixingVideos = [
    { src: '/videos/pigment-mixing/pigment-mixing-videos (1).MP4', title: 'Leeukopf lab technician mixing custom gel polish pigments' },
    { src: '/videos/pigment-mixing/pigment-mixing-videos (2).MP4', title: 'Weighing raw pigment at the Leeukopf factory' },
    { src: '/videos/pigment-mixing/pigment-mixing-videos (3).mp4', title: 'Industrial mixer producing gel polish base' },
    { src: '/videos/pigment-mixing/pigment-mixing-videos (4).mp4', title: 'Colour dispersion in gel polish formula' },
    { src: '/videos/pigment-mixing/pigment-mixing-videos (5).mp4', title: 'QC testing gel polish viscosity in the lab' },
    { src: '/videos/pigment-mixing/pigment-mixing-videos (6).mp4', title: 'Custom shade production at Leeukopf' },
    { src: '/videos/pigment-mixing/pigment-mixing-videos (7).mp4', title: 'Technician filling gel polish bottles on the production line' },
    { src: '/videos/pigment-mixing/pigment-mixing-videos (8).mp4', title: 'Colour consistency check before batch approval' },
    { src: '/videos/pigment-mixing/pigment-mixing-videos (9).mp4', title: 'High-speed mixing of professional gel formula' },
    { src: '/videos/pigment-mixing/pigment-mixing-videos (10).mp4', title: 'Factory floor production at Leeukopf Laboratories' },
    { src: '/videos/pigment-mixing/pigment-mixing-videos (11).mp4', title: 'Pigment scale and batch records — GMP compliance' },
    { src: '/videos/pigment-mixing/pigment-mixing-videos (12).mp4', title: 'Effect pigment blending for cat-eye gel polish' },
    { src: '/videos/pigment-mixing/pigment-mixing-videos (13).mp4', title: 'Neutral tone gel polish being mixed in the lab' },
    { src: '/videos/pigment-mixing/pigment-mixing-videos (14).mp4', title: 'Nail gel homogenisation process at Leeukopf' },
    { src: '/videos/pigment-mixing/pigment-mixing-videos (15).mp4', title: 'Lab technician recording formula batch data' },
    { src: '/videos/pigment-mixing/pigment-mixing-videos (16).mp4', title: 'Final visual inspection before gel polish shipment' },
  ];

  return (
    <PageTemplate
      title="About Leeukopf Laboratories"
      subtitle="In-house lab. GMP-certified. Every formula developed and produced by us — not contracted out."
      breadcrumbs={[
        { label: 'Home', path: '/' },
        { label: 'About' }
      ]}
      showCTA={true}
      heroImage="/img/hero/about-us-hero-image.jpg"
    >
      {/* Start Your Brand Banner */}
      <StartHereBanner />

      {/* Responsive intro section */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6 relative inline-block">
          Our Story
          <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-primary" aria-hidden="true"></span>
        </h2>
        <p className="text-gray-600 mb-4 font-light leading-relaxed text-sm sm:text-base">
          Leeukopf Laboratories is a GMP-certified gel polish manufacturer based in Bulgaria, EU. We develop, produce, and fill professional nail systems entirely in-house — no subcontracting, no middle layers. Our facility operates under EU Regulation 1223/2009 with full QC traceability on every batch.
        </p>
        <p className="text-gray-600 font-light leading-relaxed text-sm sm:text-base">
          We work with brand owners in 17+ countries — from first-time launches to established distributors scaling their range. Small batches welcome, long-term partnerships preferred.
        </p>
      </div>

      {/* Pigment Mixing Videos Section - Moved to top for immediate engagement */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <div className="text-center mb-6 sm:mb-8">
          <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
            Step inside our factory.
          </p>
        </div>
        <VideoGallery
          videos={pigmentMixingVideos}
          title="See Pigment and Colour Being Mixed"
          subtitle="Watch our expert technicians create custom gel polish colors through precise pigment blending"
        />
      </div>

      {/* Responsive Quality & Compliance */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6 relative inline-block">
          Quality & Compliance
          <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-primary" aria-hidden="true"></span>
        </h2>
        <p className="text-gray-600 mb-4 font-light leading-relaxed text-sm sm:text-base">
          Our products are manufactured under strict GMP guidelines and comply with EU Regulation 1223/2009. We maintain comprehensive Safety Data Sheets and Product Information Files for all formulations. Every batch undergoes rigorous testing to ensure consistency and safety.
        </p>
        <p className="text-gray-600 font-light leading-relaxed text-sm sm:text-base">
          We are proud to be cruelty-free certified and committed to ethical manufacturing practices. Our formulations are TPO-free, HEMA-free where specified, and many products carry vegan certification, reflecting our dedication to both quality and responsibility.
        </p>
      </div>

      {/* Why Choose Leeukopf Laboratories Section */}
      <WhyChooseLeeukopf />

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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          <div className="image-frame hover:shadow-lg transition-shadow">
            <OptimizedImage
              src="/img/factory/qc-intake.webp"
              alt="Quality control testing of raw materials at Leeukopf Laboratories"
              width={800}
              height={600}
              sizes={RESPONSIVE_SIZES.twoColumn}
              className="w-full h-36 sm:h-48 object-cover"
            />
            <div className="p-4 sm:p-6">
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0">
                  1
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Raw Materials & QC Intake</h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 font-light leading-relaxed">
                All incoming materials undergo rigorous quality control testing to ensure they meet our strict standards.
              </p>
            </div>
          </div>

          <div className="image-frame hover:shadow-lg transition-shadow">
            <OptimizedImage
              src="/img/factory/formulation-and-mixing.jpg"
              alt="Industrial mixing equipment for gel polish formulation at Leeukopf factory"
              width={800}
              height={600}
              sizes={RESPONSIVE_SIZES.twoColumn}
              className="w-full h-36 sm:h-48 object-cover"
            />
            <div className="p-4 sm:p-6">
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0">
                  2
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Formulation & Mixing</h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 font-light leading-relaxed">
                Precise formulations are mixed in controlled environments to achieve perfect consistency and color accuracy.
              </p>
            </div>
          </div>

          <div className="image-frame hover:shadow-lg transition-shadow">
            <OptimizedImage
              src="/img/factory/pigment-blending.jpg"
              alt="Pigment blending process for custom gel polish colors at Leeukopf"
              width={800}
              height={600}
              sizes={RESPONSIVE_SIZES.twoColumn}
              className="w-full h-36 sm:h-48 object-cover"
            />
            <div className="p-4 sm:p-6">
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0">
                  3
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Pigment Blending</h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 font-light leading-relaxed">
                Expert color development ensures vibrant, consistent pigments for professional-grade nail products.
              </p>
            </div>
          </div>

          <div className="image-frame hover:shadow-lg transition-shadow">
            <OptimizedImage
              src="/img/factory/quality-control.jpg"
              alt="Precision mixer equipment for final product quality at Leeukopf factory"
              width={800}
              height={600}
              sizes={RESPONSIVE_SIZES.twoColumn}
              className="w-full h-36 sm:h-48 object-cover"
            />
            <div className="p-4 sm:p-6">
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0">
                  4
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
    </PageTemplate>
  );
}
