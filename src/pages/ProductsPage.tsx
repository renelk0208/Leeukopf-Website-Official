import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import PageTemplate from '../components/PageTemplate';

/** Video item for the colour mixing section */
interface VideoItem {
  id: string;
  title: string;
  description: string;
  src: string;
}

/**
 * Determines the MIME type for a video file based on its extension.
 * @param src - The video source path
 * @returns The appropriate MIME type string
 */
function getVideoMimeType(src: string): string {
  const extension = src.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'mov':
      return 'video/quicktime';
    case 'webm':
      return 'video/webm';
    case 'ogg':
    case 'ogv':
      return 'video/ogg';
    case 'mp4':
    default:
      return 'video/mp4';
  }
}

export default function ProductsPage() {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  
  const categories = [
    {
      title: 'Gel Polish',
      description: 'Professional gel polish systems including French Collection, Solid Colours, Glitters, and complete Tops, Bases & Primers range.',
      path: '/products/gel-polish',
      image: '/img/products/gel_polish_category_1.jpg'
    },
    {
      title: 'Builder Systems',
      description: 'Advanced builder gels including 3-in-1 systems, fibreglass reinforcement, acrylics, and innovative polygel formulations.',
      path: '/products/builder-systems',
      image: '/img/products/builder_gels_category_2.jpg'
    },
    {
      title: 'Tops, Bases & Primers',
      description: 'Complete foundation and finishing systems including wipe-off and non-wipe tops, superior bases, and professional primers.',
      path: '/products/tops-bases-primers',
      image: '/img/products/tops & bases_category_1.jpg'
    }
  ];

  // All mixing videos available in the repository
  // Located at: public/img/mixing/videos/
  const videos: VideoItem[] = [
    {
      id: 'mixing-2',
      title: 'Precision Pigment Blending',
      description: 'Highly pigmented formulas crafted in our EU-compliant Bulgarian facility.',
      src: '/img/mixing/videos/Mixing-2.mp4'
    },
    {
      id: 'mixing-3',
      title: 'Colour Consistency Control',
      description: 'Each batch precision-measured to ensure uniform colour and viscosity.',
      src: '/img/mixing/videos/Mixing-3.mp4'
    },
    {
      id: 'mixing-4',
      title: 'Self-Levelling Formulation',
      description: 'Advanced formulas for smooth, self-levelling application every time.',
      src: '/img/mixing/videos/Mixing-4.mp4'
    },
    {
      id: 'mixing-5',
      title: 'Laboratory Quality Standards',
      description: 'Manufactured under strict cleanroom protocols and safety regulations.',
      src: '/img/mixing/videos/Mixing(5).MP4'
    },
    {
      id: 'mixing-10',
      title: 'Viscosity Testing',
      description: 'Rigorous quality control ensures professional-grade performance.',
      src: '/img/mixing/videos/Mixing(10).MOV'
    },
    {
      id: 'mixing-11',
      title: 'Colour Mixing Expertise',
      description: 'Hand-finished with precision for true colour intensity and coverage.',
      src: '/img/mixing/videos/Mixing(11).MOV'
    },
    {
      id: 'mixing-12',
      title: 'Premium Ingredient Preparation',
      description: 'Only the finest EU-approved ingredients in our formulations.',
      src: '/img/mixing/videos/Mixing(12).MOV'
    },
    {
      id: 'mixing-13',
      title: 'Factory Production Process',
      description: 'Behind-the-scenes look at our state-of-the-art production line.',
      src: '/img/mixing/videos/Mixing(13).MOV'
    },
    {
      id: 'mixing-14',
      title: 'Final Quality Inspection',
      description: 'Every product undergoes thorough inspection before distribution.',
      src: '/img/mixing/videos/Mixing(14).MOV'
    }
  ];

  // Ensure videos play on iOS devices
  useEffect(() => {
    videoRefs.current.forEach(video => {
      if (video) {
        video.play().catch(() => {
          // Autoplay was prevented, which is expected on some devices
          // Video will play when it becomes visible
        });
      }
    });
  }, []);

  return (
    <PageTemplate
      title="Our Products"
      subtitle="Professional nail care systems designed for perfection. From gel polish to builder systems, explore our complete range."
      breadcrumbs={[
        { label: 'Home', path: '/' },
        { label: 'Our Products' }
      ]}
      showCTA={true}
      ctaText="Request Product Catalogue"
    >
      {/* Responsive product category grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-10 sm:mb-12 md:mb-16">
        {categories.map((category) => (
          <Link
            key={category.path}
            to={category.path}
            className="group block p-4 sm:p-6 md:p-8 bg-white rounded-lg border border-gray-200 hover:border-blue-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
          >
            <div className="aspect-square bg-gray-100 rounded-lg mb-4 sm:mb-6 border border-gray-200 group-hover:border-blue-500 transition-colors overflow-hidden flex items-center justify-center">
              {category.image ? (
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : null}
            </div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3 group-hover:text-blue-800 transition-colors">
              {category.title}
            </h3>
            <p className="text-gray-600 font-light leading-relaxed text-sm sm:text-base">
              {category.description}
            </p>
            <div className="mt-3 sm:mt-4 text-blue-800 font-semibold group-hover:text-blue-900 text-sm sm:text-base">
              Explore Collection →
            </div>
          </Link>
        ))}
      </div>

      {/* Responsive features section */}
      <div className="bg-gray-50 rounded-lg p-4 sm:p-6 md:p-8 border border-gray-200 mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6 text-center">Why Our Products Stand Out</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          <div className="text-center">
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">💎</div>
            <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Premium Quality</h3>
            <p className="text-xs sm:text-sm text-gray-600 font-light">Formulated with the finest ingredients for exceptional performance and durability.</p>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🎨</div>
            <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Extensive Range</h3>
            <p className="text-xs sm:text-sm text-gray-600 font-light">From classic shades to trendy colors, we offer complete product ecosystems.</p>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">⚡</div>
            <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Professional Grade</h3>
            <p className="text-xs sm:text-sm text-gray-600 font-light">Trusted by nail technicians worldwide for salon-quality results.</p>
          </div>
        </div>
      </div>

      {/* Mixing videos section - uses responsive CSS classes from index.css */}
      <section className="mixing-videos-section">
        <h2 className="mixing-title text-xl sm:text-2xl md:text-3xl">Colour Mixing — Behind the Scenes</h2>
        <p className="mixing-text text-sm sm:text-base">
          Highly pigmented professional formulas created under strict EU regulations,
          precision-measured, and hand-finished in our laboratory.
        </p>

        <div className="mixing-grid">
          {videos.map((video, index) => (
            <div key={video.id} className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm">
              <video 
                ref={el => videoRefs.current[index] = el}
                className="mixing-video aspect-video" 
                autoPlay 
                muted 
                loop 
                playsInline 
                preload="metadata"
                aria-label={video.title}
                controls={false}
                title={video.title}
              >
                <source src={video.src} type={getVideoMimeType(video.src)} />
                Your browser does not support the video tag.
              </video>
              <div className="p-3 sm:p-4">
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-1">{video.title}</h3>
                <p className="text-xs sm:text-sm text-gray-600 font-light">{video.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </PageTemplate>
  );
}
