import {
  Factory,
  FlaskConical,
  Sparkles,
  Palette,
  ShieldCheck,
  Clock,
  TrendingUp,
  Package,
  Users,
  HeartHandshake
} from 'lucide-react';
import { ComponentType } from 'react';

interface Reason {
  title: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
}

const reasons: Reason[] = [
  {
    title: 'In-House EU Manufacturing',
    description: 'We produce everything in our own Bulgarian laboratory. No outsourcing, no uncertainty.',
    icon: Factory
  },
  {
    title: 'Batch-to-Batch Consistency',
    description: 'Precision pigment control and viscosity testing ensure identical performance every time.',
    icon: FlaskConical
  },
  {
    title: 'Private Label Made Simple',
    description: 'Clear steps, fast onboarding, and full support without unnecessary complexity.',
    icon: Sparkles
  },
  {
    title: 'Over 2,000 Shades & Ongoing Innovation',
    description: 'Seasonal collections, trend forecasting, and custom colour development.',
    icon: Palette
  },
  {
    title: 'Advanced 21-Free, HEMA-Free, TPO-Free Formulas',
    description: 'Always ahead of regulatory changes to keep brands compliant and competitive.',
    icon: ShieldCheck
  },
  {
    title: 'Fast, Reliable Production Times',
    description: 'Delivery dates are respected and production timetables are transparent.',
    icon: Clock
  },
  {
    title: 'Flexible MOQs',
    description: 'Ideal for both emerging brands and established distributors.',
    icon: TrendingUp
  },
  {
    title: 'Premium Packaging Options',
    description: 'Bottles, jars, brushes and labels designed for a luxury, professional finish.',
    icon: Package
  },
  {
    title: 'Industry-Focused Expertise',
    description: 'A team that understands chemistry, product performance, and what sells in the market.',
    icon: Users
  },
  {
    title: 'Real Human Support',
    description: 'Quick, clear communication from a team who acts like an extension of your brand.',
    icon: HeartHandshake
  }
];

export default function WhyChooseLeeukopf() {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-blue-50 via-white to-gray-50 rounded-xl mb-10 sm:mb-12 md:mb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 tracking-tight">
            Why Choose Leeukopf Laboratories as Your Manufacturing Partner
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-2 font-light">
            Discover the advantages that set us apart as a trusted private label partner in the beauty industry.
          </p>
        </div>

        {/* Responsive feature cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
          {reasons.map((reason, index) => {
            const IconComponent = reason.icon;
            return (
              <article
                key={index}
                className="group bg-white rounded-xl border border-gray-200 p-5 sm:p-6 shadow-sm hover:shadow-lg hover:border-blue-300 hover:-translate-y-1 transition-all duration-300"
              >
                {/* Icon */}
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-800 text-white rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-900 transition-colors duration-300">
                  <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                {/* Title */}
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 leading-snug">
                  {reason.title}
                </h3>
                {/* Description */}
                <p className="text-sm sm:text-base text-gray-600 font-light leading-relaxed">
                  {reason.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
