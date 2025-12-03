import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CheckCircle } from 'lucide-react';
import PageTemplate from '../components/PageTemplate';
import StartHereBanner from '../components/StartHereBanner';
import GelPolishCategoryGallery from '../components/GelPolishCategoryGallery';

export default function ProductsPage() {
  const { t } = useTranslation(['products', 'common']);

  // Product range sections with their keys
  const productRanges = [
    { key: 'gelPolish' },
    { key: 'builderGels' },
    { key: 'basesTops' },
    { key: 'specialty' },
    { key: 'care' },
  ];

  return (
    <PageTemplate
      title={t('hero.title')}
      subtitle={t('hero.subtitle')}
      breadcrumbs={[
        { label: t('nav.home', { ns: 'common' }), path: '/' },
        { label: t('nav.products', { ns: 'common' }) }
      ]}
      showCTA={true}
      ctaText={t('hero.ctaPrimary')}
      heroImage="/img/hero/our-products-hero (2).jpg"
    >
      {/* Start Your Brand Banner */}
      <StartHereBanner />

      {/* Hero CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10 sm:mb-12 md:mb-16">
        <Link
          to="/products/gel-polish"
          className="btn-primary px-6 py-3 rounded-lg font-semibold text-center"
        >
          {t('hero.ctaPrimary')}
        </Link>
        <Link
          to="/private-label"
          className="btn-secondary px-6 py-3 rounded-lg font-semibold text-center"
        >
          {t('hero.ctaSecondary')}
        </Link>
      </div>

      {/* Intro Section */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6 relative inline-block">
          {t('intro.title')}
          <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-primary" aria-hidden="true"></span>
        </h2>
        <p className="text-gray-600 font-light leading-relaxed text-sm sm:text-base max-w-3xl">
          {t('intro.text')}
        </p>
      </div>

      {/* Gel Polish Categories Gallery */}
      <GelPolishCategoryGallery />

      {/* Product Ranges Section */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 sm:mb-8 text-center">
          {t('ranges.title')}
        </h2>
        <div className="space-y-8">
          {productRanges.map((range) => (
            <div
              key={range.key}
              className="bg-white rounded-lg border border-gray-200 p-5 sm:p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">
                {t(`ranges.${range.key}.title`)}
              </h3>
              <p className="text-gray-600 font-light leading-relaxed text-sm sm:text-base mb-4">
                {t(`ranges.${range.key}.text`)}
              </p>
              <ul className="space-y-2">
                {(t(`ranges.${range.key}.bullets`, { returnObjects: true }) as string[]).map((bullet, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Manufacturing Section */}
      <div className="bg-gray-50 rounded-lg p-5 sm:p-6 md:p-8 border border-gray-200 mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">
          {t('manufacturing.title')}
        </h2>
        <p className="text-gray-600 font-light leading-relaxed text-sm sm:text-base mb-4">
          {t('manufacturing.text')}
        </p>
        <ul className="space-y-2">
          {(t('manufacturing.bullets', { returnObjects: true }) as string[]).map((bullet, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Compliance Section */}
      <div className="bg-white rounded-lg p-5 sm:p-6 md:p-8 border border-gray-200 mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">
          {t('compliance.title')}
        </h2>
        <p className="text-gray-600 font-light leading-relaxed text-sm sm:text-base mb-4">
          {t('compliance.text')}
        </p>
        <ul className="space-y-2">
          {(t('compliance.bullets', { returnObjects: true }) as string[]).map((bullet, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-50 rounded-lg p-5 sm:p-6 md:p-8 text-center">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
          {t('ctaSection.title')}
        </h2>
        <p className="text-gray-600 font-light leading-relaxed text-sm sm:text-base mb-6 max-w-2xl mx-auto">
          {t('ctaSection.text')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/contact"
            className="btn-primary px-6 py-3 rounded-lg font-semibold"
          >
            {t('ctaSection.ctaPrimary')}
          </Link>
          <Link
            to="/private-label"
            className="btn-secondary px-6 py-3 rounded-lg font-semibold"
          >
            {t('ctaSection.ctaSecondary')}
          </Link>
        </div>
      </div>
    </PageTemplate>
  );
}
