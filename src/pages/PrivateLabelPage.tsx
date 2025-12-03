import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PageTemplate from '../components/PageTemplate';
import StartHereBanner from '../components/StartHereBanner';
import { Beaker, Settings, ShieldCheck, Handshake, Users, Building2, GraduationCap, CheckCircle } from 'lucide-react';

export default function PrivateLabelPage() {
  const { t } = useTranslation(['privateLabel', 'common']);

  // Benefits items with icons
  const benefitItems = [
    { key: 'expertise', icon: Beaker },
    { key: 'flexibility', icon: Settings },
    { key: 'compliance', icon: ShieldCheck },
    { key: 'partnership', icon: Handshake },
  ];

  // Process steps
  const processSteps = [
    'consultation',
    'selection',
    'sampling',
    'packaging',
    'compliance',
    'production',
  ];

  // Who is for items with icons
  const whoIsForItems = [
    { key: 'distributors', icon: Building2 },
    { key: 'brands', icon: Users },
    { key: 'educators', icon: GraduationCap },
  ];

  return (
    <PageTemplate
      title={t('hero.title')}
      subtitle={t('hero.subtitle')}
      breadcrumbs={[
        { label: t('nav.home', { ns: 'common' }), path: '/' },
        { label: t('nav.privateLabel', { ns: 'common' }) }
      ]}
      showCTA={true}
      ctaText={t('hero.ctaPrimary')}
      heroImage="/img/hero/private-label-hero.jpg"
    >
      {/* Start Your Brand Banner */}
      <StartHereBanner />

      {/* Hero CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10 sm:mb-12 md:mb-16">
        <Link
          to="/contact"
          className="btn-primary px-6 py-3 rounded-lg font-semibold text-center"
        >
          {t('hero.ctaPrimary')}
        </Link>
        <Link
          to="/contact"
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

      {/* Benefits Section */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 sm:mb-8 text-center">
          {t('benefits.title')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {benefitItems.map((item) => (
            <div
              key={item.key}
              className="bg-white rounded-lg border border-gray-200 p-5 sm:p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
                  <item.icon size={24} className="text-primary" aria-hidden="true" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2 text-base sm:text-lg">
                    {t(`benefits.items.${item.key}.title`)}
                  </h3>
                  <p className="text-gray-600 font-light text-sm sm:text-base leading-relaxed">
                    {t(`benefits.items.${item.key}.text`)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Process Section */}
      <div className="bg-gray-50 rounded-lg p-5 sm:p-6 md:p-8 border border-gray-200 mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 sm:mb-8 text-center">
          {t('process.title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {processSteps.map((step) => (
            <div
              key={step}
              className="bg-white rounded-lg p-4 sm:p-5 border border-gray-200"
            >
              <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
                {t(`process.steps.${step}.title`)}
              </h3>
              <p className="text-gray-600 font-light text-xs sm:text-sm leading-relaxed">
                {t(`process.steps.${step}.text`)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* MOQs Section */}
      <div className="bg-white rounded-lg p-5 sm:p-6 md:p-8 border border-gray-200 mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">
          {t('moqs.title')}
        </h2>
        <p className="text-gray-600 font-light leading-relaxed text-sm sm:text-base mb-4">
          {t('moqs.text')}
        </p>
        <ul className="space-y-2">
          {(t('moqs.bullets', { returnObjects: true }) as string[]).map((bullet, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Who Is For Section */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 sm:mb-8 text-center">
          {t('whoIsFor.title')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {whoIsForItems.map((item) => (
            <div
              key={item.key}
              className="bg-white rounded-lg border border-gray-200 p-5 sm:p-6 text-center hover:shadow-lg transition-shadow"
            >
              <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <item.icon size={32} className="text-primary" aria-hidden="true" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-base sm:text-lg">
                {t(`whoIsFor.items.${item.key}.title`)}
              </h3>
              <p className="text-gray-600 font-light text-sm sm:text-base leading-relaxed">
                {t(`whoIsFor.items.${item.key}.text`)}
              </p>
            </div>
          ))}
        </div>
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
            to="/contact"
            className="btn-secondary px-6 py-3 rounded-lg font-semibold"
          >
            {t('ctaSection.ctaSecondary')}
          </Link>
        </div>
      </div>
    </PageTemplate>
  );
}
