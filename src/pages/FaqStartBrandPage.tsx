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
    question: 'Where do I start if I want my own gel polish brand?',
    answers: [
      'Decide between private label (ready-made, you add branding) or custom formulation.',
      'Private label is usually faster and more cost-effective for beginners.',
      'Start by choosing your core product range (colours, base, top, builders).'
    ]
  },
  {
    question: 'What products do I need for a basic launch?',
    answers: [
      'Gel polish colours (a focused starter range).',
      'Base coat.',
      'Top coat (gloss and/or matte).',
      'Optional: a few builder gels for structure or extensions.',
      'Many brands start with 20–40 shades, not hundreds.'
    ]
  },
  {
    question: 'What is the MOQ (minimum order quantity)?',
    answers: [
      'MOQ depends on packaging type and product family.',
      'Private label MOQs are kept as low as practical so you can test the market.',
      'Higher volumes unlock better pricing per unit.'
    ]
  },
  {
    question: 'Do I need my own special formula?',
    answers: [
      'No — you can use our existing EU-compliant formulations.',
      'They are already tested, stable and safety-assessed.',
      'Custom formulas are possible but take more time and budget.'
    ]
  },
  {
    question: 'Can I have my logo and design on the bottles?',
    answers: [
      'Yes, we offer silk screen, hot stamp and label options.',
      'You choose bottle style, cap, colour and printing method.',
      'We guide you based on your budget and quantities.'
    ]
  },
  {
    question: 'What is a PIF and why do I need it?',
    answers: [
      'PIF = Product Information File, legally required in the EU.',
      'Includes safety report, formula, raw-material documents, stability data and labels.',
      "Must always be available at the Responsible Person's address.",
      'We arrange PIF preparation for the products you take.'
    ]
  },
  {
    question: 'What is the CPNP and who handles it?',
    answers: [
      'CPNP = EU Cosmetic Product Notification Portal.',
      'All EU cosmetics must be notified there before sale.',
      "It's a notification system, not a 'certificate' or approval.",
      'We handle CPNP notification once PIF and labels are final.'
    ]
  },
  {
    question: 'What is a Responsible Person (RP) and do I need one?',
    answers: [
      'Every cosmetic in the EU needs an EU-based Responsible Person.',
      'The RP holds the PIF and manages compliance and safety.',
      'If you are not EU-based (or prefer not to act as RP), we can provide this service.'
    ]
  },
  {
    question: 'How long does it take to launch a new brand?',
    answers: [
      'Private label with existing formulas is the fastest route.',
      'Packaging choice and artwork: 2–4 weeks.',
      'PIF and safety work: 2–6 weeks, depending on scope.',
      'CPNP notification: a few days once everything is ready.',
      'Timing depends on how quickly artwork and key decisions are finalised.'
    ]
  },
  {
    question: 'Can I test the products before placing a big order?',
    answers: [
      'Yes, you can order samples of colours, bases, tops and builders.',
      'Test application, curing and wear with your own nail techs.',
      'We recommend testing with a 48W multi-wave LED lamp.'
    ]
  },
  {
    question: 'What documentation do I receive with my order?',
    answers: [
      'Commercial invoice with HS codes.',
      'Packing list and carton details.',
      'Certificate of Origin (if required for your country).',
      'SDS/MSDS for all relevant products.',
      'Compliance certificates (EU Regulation 1223/2009, GMP).',
      'CPNP confirmation (for EU-placed products, where applicable).'
    ]
  },
  {
    question: 'Are your products cruelty-free and compliant?',
    answers: [
      'Produced under EU Cosmetic Regulation (EC) 1223/2009.',
      'Manufactured under GMP standards.',
      {
        text: 'Approved by Cruelty Free International — covering global cruelty-free standards.',
        link: {
          url: 'https://crueltyfreeinternational.org/',
          label: 'Cruelty Free International'
        }
      },
      'Formulas are regularly updated for new regulatory changes.'
    ]
  },
  {
    question: 'Do you offer HEMA-free and TPO-free products?',
    answers: [
      'Yes — all formulations are 100 percent HEMA-free and TPO-free.',
      'This aligns with current and upcoming EU regulations.',
      'Applies to every product family: colours, bases, tops and builders.'
    ]
  },
  {
    question: 'Can I have exclusive colours or collections?',
    answers: [
      'Yes, we can create exclusive shades and seasonal collections.',
      'We can colour-match using spectrophotometer data or physical samples.',
      'Collections can be based on themes, trends or specific palettes.'
    ]
  },
  {
    question: "How do I reorder once I'm happy with the products?",
    answers: [
      'Reorder using product codes / shade codes and required quantities.',
      'Once packaging and formulas are set, repeat orders are straightforward.',
      'We can discuss volume-based pricing as your brand grows.'
    ]
  },
  {
    question: 'What curing lamps do you recommend for your gels?',
    answers: [
      'We recommend 48W multi-wave LED lamps (approx. 365–405 nm).',
      'Our formulas are optimised for modern LED technology.',
      'This ensures proper curing, gloss and durability.'
    ]
  },
  {
    question: 'What support do you offer after launch?',
    answers: [
      'Ongoing regulatory and compliance support.',
      'New shade and collection development.',
      'Guidance on scaling orders and entering distribution.'
    ]
  }
];

export default function FaqStartBrandPage() {
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
          This FAQ is for people who are completely new to launching their own gel polish brand. 
          Questions are bold and answers are in short bullet points for quick reading.
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
              Still have questions?
            </h3>
            <p className="text-gray-600 font-light mb-6 text-sm sm:text-base">
              Our team is here to help you navigate the journey of creating your own gel polish brand. 
              Whether you're just starting or ready to scale, we're committed to your success.
            </p>
            <a
              href="/contact"
              className="btn-primary inline-block px-6 sm:px-8 py-3 min-h-[44px]"
            >
              Contact Our Team
            </a>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
}
