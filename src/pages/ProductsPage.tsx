import { Link } from 'react-router-dom';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Film } from 'lucide-react';
import PageTemplate from '../components/PageTemplate';
import StartHereBanner from '../components/StartHereBanner';
import OptimizedImage from '../components/OptimizedImage';
import { RESPONSIVE_SIZES } from '../lib/responsive-sizes';

/** Video item for the factory videos section */
interface VideoItem {
  id: string;
  titleKey: string;
  descriptionKey: string;
  src: string;
}

export default function ProductsPage() {
  const { t } = useTranslation();
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [videoErrors, setVideoErrors] = useState<Set<string>>(new Set());
  const [visibleVideos, setVisibleVideos] = useState<Set<string>>(new Set());
  const [playingVideos, setPlayingVideos] = useState<Set<string>>(new Set());

  const categories = [
    {
      titleKey: 'productsPage.categories.gelPolish.title',
      descriptionKey: 'productsPage.categories.gelPolish.description',
      path: '/products/gel-polish',
      image: '/img/products/gel_polish_category_1.jpg'
    },
    {
      titleKey: 'productsPage.categories.builderSystems.title',
      descriptionKey: 'productsPage.categories.builderSystems.description',
      path: '/products/builder-systems',
      image: '/img/products/builder_gels_category_2.jpg'
    },
    {
      titleKey: 'productsPage.categories.topsBasesPrimers.title',
      descriptionKey: 'productsPage.categories.topsBasesPrimers.description',
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
      titleKey: 'productsPage.factoryProcess.videos.precisionPigmentBlending.title',
      descriptionKey: 'productsPage.factoryProcess.videos.precisionPigmentBlending.description',
      src: '/videos/factory videos/precision-pigment blending.mp4'
    },
    {
      id: 'self-levelling-formulation',
      titleKey: 'productsPage.factoryProcess.videos.selfLevellingFormulation.title',
      descriptionKey: 'productsPage.factoryProcess.videos.selfLevellingFormulation.description',
      src: '/videos/factory videos/Self-Levelling Formulation.mp4'
    },
    {
      id: 'viscosity-testing',
      titleKey: 'productsPage.factoryProcess.videos.viscosityTesting.title',
      descriptionKey: 'productsPage.factoryProcess.videos.viscosityTesting.description',
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
      title={t('productsPage.title')}
      subtitle={t('productsPage.subtitle')}
      breadcrumbs={[
        { label: t('nav.home'), path: '/' },
        { label: t('productsPage.title') }
      ]}
      showCTA={true}
      ctaText={t('productsPage.ctaText')}
      heroImage="/img/hero/our-products-hero (2).jpg"
    >
      {/* Start Your Brand Banner */}
      <StartHereBanner />

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
                  alt={t(category.titleKey)}
                  width={600}
                  height={600}
                  sizes={RESPONSIVE_SIZES.threeColumn}
                  className="w-full h-full object-cover"
                />
              ) : null}
            </div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3 group-hover:text-blue-800 transition-colors">
              {t(category.titleKey)}
            </h3>
            <p className="text-gray-600 font-light leading-relaxed text-sm sm:text-base">
              {t(category.descriptionKey)}
            </p>
            <div className="mt-3 sm:mt-4 text-blue-800 font-semibold group-hover:text-blue-900 text-sm sm:text-base">
              {t('productsPage.exploreCollection')} →
            </div>
          </Link>
        ))}
      </div>

      {/* Responsive features section */}
      <div className="bg-gray-50 rounded-lg p-4 sm:p-6 md:p-8 border border-gray-200 mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6 text-center">{t('productsPage.whyStandOut.title')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          <div className="text-center">
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">💎</div>
            <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">{t('productsPage.whyStandOut.premiumQuality.title')}</h3>
            <p className="text-xs sm:text-sm text-gray-600 font-light">{t('productsPage.whyStandOut.premiumQuality.description')}</p>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🎨</div>
            <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">{t('productsPage.whyStandOut.extensiveRange.title')}</h3>
            <p className="text-xs sm:text-sm text-gray-600 font-light">{t('productsPage.whyStandOut.extensiveRange.description')}</p>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">⚡</div>
            <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">{t('productsPage.whyStandOut.professionalGrade.title')}</h3>
            <p className="text-xs sm:text-sm text-gray-600 font-light">{t('productsPage.whyStandOut.professionalGrade.description')}</p>
          </div>
        </div>
      </div>

      {/* Factory videos section - uses responsive CSS classes from index.css */}
      <section className="mixing-videos-section">
        <h2 className="mixing-title text-xl sm:text-2xl md:text-3xl">{t('productsPage.factoryProcess.title')}</h2>
        <p className="mixing-text text-sm sm:text-base">
          {t('productsPage.factoryProcess.description')}
        </p>

        <div className="mixing-grid">
          {videos.map((video, index) => (
            <div key={video.id} className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm">
              {videoErrors.has(video.id) ? (
                <div className="aspect-video bg-gray-100 flex flex-col items-center justify-center text-gray-500">
                  <Film className="w-12 h-12 mb-2" />
                  <p className="text-sm">{t('productsPage.factoryProcess.videoNotSupported')}</p>
                  <p className="text-xs text-gray-400 mt-1">{t('productsPage.factoryProcess.tryDifferentBrowser')}</p>
                </div>
              ) : (
                <div 
                  className="relative cursor-pointer group"
                  role="button"
                  tabIndex={0}
                  aria-label={`Play video: ${t(video.titleKey)}`}
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
                    aria-label={t(video.titleKey)}
                    controls={false}
                    title={t(video.titleKey)}
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
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-1">{t(video.titleKey)}</h3>
                <p className="text-xs sm:text-sm text-gray-600 font-light">{t(video.descriptionKey)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </PageTemplate>
  );
}
