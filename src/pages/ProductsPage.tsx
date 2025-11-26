import { Link } from 'react-router-dom';
import { useEffect, useRef, useState, useCallback } from 'react';
import { Film } from 'lucide-react';
import PageTemplate from '../components/PageTemplate';
import OptimizedImage from '../components/OptimizedImage';
import { RESPONSIVE_SIZES } from '../lib/responsive-sizes';

/** Video item for the factory videos section */
interface VideoItem {
  id: string;
  title: string;
  description: string;
  src: string;
}

export default function ProductsPage() {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [videoErrors, setVideoErrors] = useState<Set<string>>(new Set());
  const [visibleVideos, setVisibleVideos] = useState<Set<string>>(new Set());
  const [playingVideos, setPlayingVideos] = useState<Set<string>>(new Set());

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

  // Factory videos showcasing our production process
  // Located at: public/videos/factory videos/
  // Only .mp4 files are supported - 3 videos explicitly referenced
  const videos: VideoItem[] = [
    {
      id: 'precision-pigment-blending',
      title: 'Precision Pigment Blending',
      description: 'Highly pigmented formulas crafted in our EU-compliant Bulgarian facility.',
      src: '/videos/factory videos/precision-pigment blending.mp4'
    },
    {
      id: 'self-levelling-formulation',
      title: 'Self-Levelling Formulation',
      description: 'Advanced formulas for smooth, self-levelling application every time.',
      src: '/videos/factory videos/Self-Levelling Formulation.mp4'
    },
    {
      id: 'viscosity-testing',
      title: 'Viscosity Testing',
      description: 'Rigorous quality control ensures professional-grade performance.',
      src: '/videos/factory videos/Viscosity Testing.mp4'
    }
  ];

  // Lazy loading with IntersectionObserver - only load videos when visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const videoId = entry.target.getAttribute('data-video-id');
          if (videoId && entry.isIntersecting) {
            setVisibleVideos((prev) => new Set([...prev, videoId]));
          }
        });
      },
      { threshold: 0.25 }
    );

    videoRefs.current.forEach((video) => {
      if (video) {
        observer.observe(video);
      }
    });

    return () => observer.disconnect();
  }, []);

  // Handle video errors
  const handleVideoError = useCallback((videoId: string) => {
    setVideoErrors((prev) => new Set([...prev, videoId]));
  }, []);

  // Handle click-to-play
  const handleVideoClick = useCallback((videoId: string, index: number) => {
    const video = videoRefs.current[index];
    if (!video) return;

    if (playingVideos.has(videoId)) {
      video.pause();
      setPlayingVideos((prev) => {
        const next = new Set(prev);
        next.delete(videoId);
        return next;
      });
    } else {
      video.play().catch(() => {
        handleVideoError(videoId);
      });
      setPlayingVideos((prev) => new Set([...prev, videoId]));
    }
  }, [playingVideos, handleVideoError]);

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
                <OptimizedImage
                  src={category.image}
                  alt={category.title}
                  width={600}
                  height={600}
                  sizes={RESPONSIVE_SIZES.threeColumn}
                  className="w-full h-full object-cover"
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

      {/* Factory videos section - uses responsive CSS classes from index.css */}
      <section className="mixing-videos-section">
        <h2 className="mixing-title text-xl sm:text-2xl md:text-3xl">Factory Process — Behind the Scenes</h2>
        <p className="mixing-text text-sm sm:text-base">
          Highly pigmented professional formulas created under strict EU regulations,
          precision-measured, and hand-finished in our laboratory.
        </p>

        <div className="mixing-grid">
          {videos.map((video, index) => (
            <div key={video.id} className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm">
              {videoErrors.has(video.id) ? (
                <div className="aspect-video bg-gray-100 flex flex-col items-center justify-center text-gray-500">
                  <Film className="w-12 h-12 mb-2" />
                  <p className="text-sm">Video format not supported</p>
                  <p className="text-xs text-gray-400 mt-1">Try a different browser</p>
                </div>
              ) : (
                <div 
                  className="relative cursor-pointer group"
                  role="button"
                  tabIndex={0}
                  aria-label={`Play video: ${video.title}`}
                  onClick={() => handleVideoClick(video.id, index)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleVideoClick(video.id, index);
                    }
                  }}
                >
                  <video 
                    ref={el => videoRefs.current[index] = el}
                    data-video-id={video.id}
                    className="mixing-video aspect-video" 
                    muted 
                    loop 
                    playsInline 
                    preload="none"
                    aria-label={video.title}
                    controls={false}
                    title={video.title}
                    onError={() => handleVideoError(video.id)}
                  >
                    {visibleVideos.has(video.id) && (
                      <source src={video.src} type="video/mp4" />
                    )}
                    Your browser does not support the video tag.
                  </video>
                  {!playingVideos.has(video.id) && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                      <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <svg className="w-8 h-8 text-gray-800 ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              )}
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
