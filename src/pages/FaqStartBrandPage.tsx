import { useTranslation } from 'react-i18next';
import PageTemplate from '../components/PageTemplate';

export default function FaqStartBrandPage() {
  const { t } = useTranslation();

  // Build FAQ items from translation keys
  const faqKeys = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10', 'q11', 'q12', 'q13', 'q14', 'q15', 'q16', 'q17'];
  
  const faqItems = faqKeys.map(key => ({
    question: t(`faqPage.questions.${key}.question`),
    answers: t(`faqPage.questions.${key}.answers`, { returnObjects: true }) as string[],
    hasLink: key === 'q12' // Special case for cruelty-free link
  }));

  return (
    <PageTemplate
      title={t('faqPage.title')}
      subtitle={t('faqPage.subtitle')}
      breadcrumbs={[
        { label: t('nav.home'), path: '/' },
        { label: t('nav.faq') }
      ]}
      showCTA={true}
      ctaText="Get Started Today"
      heroImage="/img/hero/faq-starting-a-gel-polish-brand.jpg"
    >
      {/* FAQ Introduction */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <p className="text-gray-600 font-light leading-relaxed text-sm sm:text-base max-w-4xl">
          {t('faqPage.introduction')}
        </p>
      </div>

      {/* FAQ List */}
      <div className="space-y-8 sm:space-y-10 max-w-4xl">
        {faqItems.map((item, index) => (
          <article key={index} className="border-b border-gray-200 pb-8 sm:pb-10 last:border-b-0">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-4 leading-tight">
              Q{index + 1}: {item.question}
            </h2>
            <ul className="space-y-2 sm:space-y-3" role="list">
              {item.answers.map((answer, answerIndex) => (
                <li key={answerIndex} className="flex items-start gap-3">
                  <span className="text-brandFuchsia mt-1.5 flex-shrink-0" aria-hidden="true">•</span>
                  <span className="text-gray-600 font-light leading-relaxed text-sm sm:text-base">
                    {answer}
                    {item.hasLink && answerIndex === 2 && (
                      <>
                        {' '}
                        <a
                          href="https://crueltyfreeinternational.org/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-brandFuchsia hover:underline focus:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brandFuchsia focus-visible:ring-offset-2 font-medium"
                        >
                          {t('faqPage.crueltyFreeLink')} →
                        </a>
                      </>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      {/* Additional Help Section */}
      <div className="mt-12 sm:mt-16 md:mt-20">
        <div className="card p-6 sm:p-8 md:p-10 section-gradient-primary">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
              {t('faqPage.stillHaveQuestions')}
            </h3>
            <p className="text-gray-600 font-light mb-6 text-sm sm:text-base">
              {t('faqPage.contactTeamDescription')}
            </p>
            <a
              href="/contact"
              className="btn-primary inline-block px-6 sm:px-8 py-3 min-h-[44px]"
            >
              {t('faqPage.contactTeam')}
            </a>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
}
