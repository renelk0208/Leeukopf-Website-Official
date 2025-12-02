import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import OptimizedImage from './OptimizedImage';
import { RESPONSIVE_SIZES } from '../lib/responsive-sizes';

export default function Hero() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <section id="home" className="relative min-h-[50vh] sm:min-h-[60vh] md:min-h-[70vh] lg:min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Responsive padding: more compact on mobile, spacious on desktop */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20 pb-8 md:pb-12">
        <div className="space-y-6 md:space-y-8">
          {/* Logo with responsive sizing - marked as high priority for LCP */}
          <div className="flex justify-center mb-6 md:mb-8">
            <OptimizedImage
              src="/leeukopf_black.png"
              alt="Leeukopf Laboratories Logo"
              width={800}
              height={200}
              sizes={RESPONSIVE_SIZES.hero}
              lazy={false}
              fetchPriority="high"
              className="w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-3xl h-auto object-contain px-4 sm:px-8"
            />
          </div>

          {/* Responsive typography with clamp-like approach */}
          <p className="text-lg sm:text-xl md:text-2xl text-gray-800 max-w-3xl mx-auto leading-relaxed font-medium px-2">
            {t('hero.tagline')}
          </p>

          <p className="text-base sm:text-lg text-gray-700 max-w-2xl mx-auto font-medium px-2">
            {t('hero.description')}
          </p>

          {/* Responsive button group with full-width on mobile */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center pt-4 sm:pt-6 px-4 sm:px-0">
            <button
              onClick={() => navigate('/products')}
              className="btn-primary w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 min-h-[44px]"
            >
              {t('hero.exploreProducts')}
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 min-h-[44px] bg-white rounded-md font-semibold transition-all duration-300 border-2 text-primary border-primary hover:bg-primary hover:text-white"
            >
              {t('hero.contactUs')}
            </button>
          </div>

          {/* Responsive stats grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto pt-8 sm:pt-12 md:pt-16 px-2 sm:px-0">
            <div className="p-4 sm:p-6 bg-white rounded-xl border-2 border-primary-100 shadow-lg hover:shadow-xl hover:border-primary transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-2xl sm:text-3xl font-bold text-primary mb-1 sm:mb-2 tracking-tight">{t('hero.stats.colours')}</div>
              <div className="text-gray-800 font-semibold text-sm sm:text-base">{t('hero.stats.coloursLabel')}</div>
              <div className="text-gray-600 text-xs sm:text-sm mt-1 font-light">{t('hero.stats.coloursDesc')}</div>
            </div>
            <div className="p-4 sm:p-6 bg-white rounded-xl border-2 border-primary-100 shadow-lg hover:shadow-xl hover:border-primary transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-2xl sm:text-3xl font-bold text-primary mb-1 sm:mb-2 tracking-tight">{t('hero.stats.builder')}</div>
              <div className="text-gray-800 font-semibold text-sm sm:text-base">{t('hero.stats.builderLabel')}</div>
              <div className="text-gray-600 text-xs sm:text-sm mt-1 font-light">{t('hero.stats.builderDesc')}</div>
            </div>
            <div className="p-4 sm:p-6 bg-white rounded-xl border-2 border-primary-100 shadow-lg hover:shadow-xl hover:border-primary transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-2xl sm:text-3xl font-bold text-primary mb-1 sm:mb-2 tracking-tight">{t('hero.stats.nailArt')}</div>
              <div className="text-gray-800 font-semibold text-sm sm:text-base">{t('hero.stats.nailArtLabel')}</div>
              <div className="text-gray-600 text-xs sm:text-sm mt-1 font-light">{t('hero.stats.nailArtDesc')}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
