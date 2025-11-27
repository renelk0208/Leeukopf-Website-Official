import { FlaskConical, Palette, HeartHandshake } from 'lucide-react';
import { ComponentType } from 'react';

interface FeatureBlock {
  title: string;
  bullets: string[];
  icon: ComponentType<{ className?: string }>;
}

const featureBlocks: FeatureBlock[] = [
  {
    title: 'Science & Manufacturing Excellence',
    bullets: [
      'In-house EU formulation and production in our Bulgarian lab',
      'Ultra-clean 21-free, HEMA-free, cruelty-free systems',
      'Precision batch-to-batch consistency and viscosity control',
      'Strict QA and controlled environments for every run'
    ],
    icon: FlaskConical
  },
  {
    title: 'Shade Innovation & Luxury Branding',
    bullets: [
      'Over 2,000 professional gel shades ready to launch',
      'Bespoke colours engineered exactly to spec',
      'Luxury-grade packaging: bottles, jars, brushes, labels',
      'Seasonal collections and trend-led colour development'
    ],
    icon: Palette
  },
  {
    title: 'Partnership & Reliability',
    bullets: [
      'Private label made simple with clear, guided onboarding',
      'Fast, reliable production timelines and transparent scheduling',
      'Flexible MOQs for both emerging brands and established distributors',
      'Real, responsive human support throughout the process'
    ],
    icon: HeartHandshake
  }
];

export default function WhyChooseLeeukopf() {
  return (
    <section className="py-8 sm:py-10 md:py-12 mb-8 sm:mb-10 md:mb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section heading - more compact */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 tracking-tight">
            Why Choose Leeukopf Laboratories
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto font-light">
            Your trusted private label manufacturing partner
          </p>
        </div>

        {/* Horizontally scrollable on mobile, 3-column grid on desktop */}
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:pb-0 scrollbar-hide">
          {featureBlocks.map((block, index) => {
            const IconComponent = block.icon;
            return (
              <article
                key={index}
                className="flex-shrink-0 w-[280px] sm:w-[300px] md:w-auto snap-start bg-white rounded-xl border border-gray-200 p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                {/* Icon */}
                <div className="w-10 h-10 bg-blue-800 text-white rounded-lg flex items-center justify-center mb-3">
                  <IconComponent className="w-5 h-5" />
                </div>
                {/* Title */}
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 leading-tight">
                  {block.title}
                </h3>
                {/* Bullet points */}
                <ul className="space-y-1.5">
                  {block.bullets.map((bullet, bulletIndex) => (
                    <li key={bulletIndex} className="flex items-start gap-2 text-xs sm:text-sm text-gray-600 font-light leading-snug">
                      <span className="text-blue-800 mt-1 flex-shrink-0">•</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
