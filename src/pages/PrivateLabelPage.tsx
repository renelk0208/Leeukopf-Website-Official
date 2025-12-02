import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PageTemplate from '../components/PageTemplate';
import StartHereBanner from '../components/StartHereBanner';
import { Beaker, Package, PencilRuler, ShieldCheck, ArrowRight } from 'lucide-react';

export default function PrivateLabelPage() {
  const { t } = useTranslation();

  const categories = [
    {
      titleKey: 'privateLabelPage.categories.bottles.title',
      descriptionKey: 'privateLabelPage.categories.bottles.description',
      path: '/private-label/bottles'
    },
    {
      titleKey: 'privateLabelPage.categories.jars.title',
      descriptionKey: 'privateLabelPage.categories.jars.description',
      path: '/private-label/jars'
    },
    {
      titleKey: 'privateLabelPage.categories.bulkOrders.title',
      descriptionKey: 'privateLabelPage.categories.bulkOrders.description',
      path: '/private-label/bulk'
    }
  ];

  const services = [
    {
      icon: Beaker,
      titleKey: 'privateLabelPage.services.customFormulations.title',
      descriptionKey: 'privateLabelPage.services.customFormulations.description'
    },
    {
      icon: PencilRuler,
      titleKey: 'privateLabelPage.services.packagingDesign.title',
      descriptionKey: 'privateLabelPage.services.packagingDesign.description'
    },
    {
      icon: ShieldCheck,
      titleKey: 'privateLabelPage.services.regulatorySupport.title',
      descriptionKey: 'privateLabelPage.services.regulatorySupport.description'
    },
    {
      icon: Package,
      titleKey: 'privateLabelPage.services.qualityAssurance.title',
      descriptionKey: 'privateLabelPage.services.qualityAssurance.description'
    }
  ];

  return (
    <PageTemplate
      title={t('privateLabelPage.title')}
      subtitle={t('privateLabelPage.subtitle')}
      breadcrumbs={[
        { label: t('nav.home'), path: '/' },
        { label: t('privateLabelPage.title') }
      ]}
      showCTA={true}
      ctaText={t('privateLabelPage.ctaText')}
      heroImage="/img/hero/private-label-hero.jpg"
    >
      {/* Start Your Brand Banner */}
      <StartHereBanner />

      {/* Responsive intro section */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6 relative inline-block">
          {t('privateLabelPage.intro.title')}
          <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-primary" aria-hidden="true"></span>
        </h2>
        <p className="text-gray-600 font-light leading-relaxed mb-6 sm:mb-8 text-sm sm:text-base">
          {t('privateLabelPage.intro.description')}
        </p>
        {/* Responsive category grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {categories.map((category) => (
            <Link
              key={category.path}
              to={category.path}
              className="card group block p-5 sm:p-6 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer"
            >
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 group-hover:text-primary transition-colors">{t(category.titleKey)}</h3>
              <p className="text-gray-600 font-light group-hover:text-gray-700 text-sm sm:text-base mb-4">{t(category.descriptionKey)}</p>
              <div className="flex items-center text-secondary font-medium text-sm group-hover:text-secondary-700 transition-colors">
                <span>{t('privateLabelPage.seeCollection')}</span>
                <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Responsive services section - restyled as feature cards */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 sm:mb-8 text-center">{t('privateLabelPage.services.title')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {services.map((service) => (
            <div
              key={service.titleKey}
              className="card p-5 sm:p-6 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
                  <service.icon size={24} className="text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2 text-base sm:text-lg">{t(service.titleKey)}</h3>
                  <p className="text-gray-600 font-light text-sm sm:text-base leading-relaxed">{t(service.descriptionKey)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageTemplate>
  );
}
