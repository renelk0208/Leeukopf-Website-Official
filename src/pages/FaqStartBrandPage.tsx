import { useEffect } from 'react';
import PageTemplate from '../components/PageTemplate';

interface FAQAnswer {
  text: string;
  link?: {
    url: string;
    label: string;
  };
}

interface FAQItem {
  question: string;
  answers: (string | FAQAnswer)[];
}

const faqItems: FAQItem[] = [
  {
    question: 'How do I start my own gel polish brand?',
    answers: [
      'Choose colours, packaging, and quantities',
      'We handle formulation, compliance, and production',
      'You launch under your own brand',
      'Full guidance from start to launch'
    ]
  },
  {
    question: 'Do I need experience in cosmetics?',
    answers: [
      'No prior experience required',
      'We guide you through every step',
      'Ideal for salons, educators, and distributors'
    ]
  },
  {
    question: 'Are your gel polishes HEMA-free?',
    answers: [
      'HEMA-free and ultra-clean options available',
      '21-free, cruelty-free systems',
      'EU-formulated and produced',
      'Fully compliant for sale'
    ]
  },
  {
    question: 'Can I create custom colours?',
    answers: [
      'Bespoke shades engineered to exact specification',
      'Pantone, reference sample, or trend-led development',
      'Suitable for hero shades or full collections'
    ]
  },
  {
    question: 'What are your minimum order quantities?',
    answers: [
      'Flexible MOQs by product type',
      'Suitable for startups and established distributors',
      'Volume pricing available'
    ]
  },
  {
    question: 'How long does production take?',
    answers: [
      'Clear timelines agreed upfront',
      'Reliable EU production schedules',
      'Transparent planning with no surprises'
    ]
  },
  {
    question: 'Do you provide packaging and labels?',
    answers: [
      'Bottles, jars, brushes, and labels available',
      'Luxury-grade packaging options',
      'Fully brand-ready solutions'
    ]
  },
  {
    question: 'Is EU compliance included?',
    answers: [
      'Full EU cosmetic compliance included',
      'Safety assessments and documentation handled',
      'Ready for legal sale'
    ]
  },
  {
    question: 'What support do you provide?',
    answers: [
      'Real, responsive human support',
      'Product training and troubleshooting',
      'Long-term partnership approach'
    ]
  }
];

export default function FaqStartBrandPage() {
  // Inject FAQPage JSON-LD schema for Google rich results
  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqItems.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answers
            .map((a) => (typeof a === 'string' ? a : a.text))
            .join(' '),
        },
      })),
    };
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'faq-schema';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
    return () => {
      document.getElementById('faq-schema')?.remove();
    };
  }, []);

  return (
    <PageTemplate
      title="Frequently Asked Questions – Starting Your Own Gel Polish Brand"
      subtitle="Everything you need to know about starting your own gel polish brand with Leeukopf Laboratories."
      breadcrumbs={[
        { label: 'Home', path: '/' },
        { label: 'FAQ – Start Your Brand' }
      ]}
      showCTA={true}
      ctaText="Get Started Today"
      heroImage="/img/hero/faq-starting-a-gel-polish-brand.jpg"
    >
      {/* FAQ Introduction */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <p className="text-gray-600 font-light leading-relaxed text-sm sm:text-base max-w-4xl">
          Everything you need to know about starting your own gel polish brand. 
          Clear answers to the most common questions from aspiring brand owners.
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
              {item.answers.map((answer, answerIndex) => {
                const isSimpleString = typeof answer === 'string';
                const answerText = isSimpleString ? answer : answer.text;
                const answerLink = isSimpleString ? null : answer.link;
                
                return (
                  <li key={answerIndex} className="flex items-start gap-3">
                    <span className="text-brandFuchsia mt-1.5 flex-shrink-0" aria-hidden="true">•</span>
                    <span className="text-gray-600 font-light leading-relaxed text-sm sm:text-base">
                      {answerText}
                      {answerLink && (
                        <>
                          {' '}
                          <a
                            href={answerLink.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-brandFuchsia hover:underline focus:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brandFuchsia focus-visible:ring-offset-2 font-medium"
                          >
                            Learn more →
                          </a>
                        </>
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
          </article>
        ))}
      </div>

      {/* Additional Help Section */}
      <div className="mt-12 sm:mt-16 md:mt-20">
        <div className="card p-6 sm:p-8 md:p-10 section-gradient-primary">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
              Ready to start your gel polish brand?
            </h3>
            <p className="text-gray-600 font-light mb-6 text-sm sm:text-base">
              Request a private label consultation and begin your journey to launching 
              your own professional gel polish brand.
            </p>
            <a
              href="/client-registration"
              className="btn-primary inline-block px-6 sm:px-8 py-3 min-h-[44px]"
            >
              Request a Private Label Consultation
            </a>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
}
