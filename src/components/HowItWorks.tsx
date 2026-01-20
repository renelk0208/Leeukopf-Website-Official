import { MessageCircle, Palette, Factory, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function HowItWorks() {
  const navigate = useNavigate();
  const steps = [
    {
      icon: MessageCircle,
      number: '1',
      title: 'Consult',
      description: 'Book a free consultation with our experts to discuss your brand vision and requirements.',
    },
    {
      icon: Palette,
      number: '2',
      title: 'Choose Colors',
      description: 'Select from our 2000+ premium gel polish colors or create custom shades for your brand.',
    },
    {
      icon: Factory,
      number: '3',
      title: 'We Manufacture',
      description: 'Our GMP-certified facility produces your products with EU compliance and HEMA-free formulations.',
    },
    {
      icon: TrendingUp,
      number: '4',
      title: 'You Sell',
      description: 'Launch your branded gel polish line and grow your beauty business with confidence.',
    },
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 tracking-tight">
            How It Works
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto font-light px-2">
            From concept to launch in 4 simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative bg-white border-2 border-gray-200 rounded-xl p-6 sm:p-8 hover:border-primary hover:shadow-lg transition-all duration-300 group"
              >
                {/* Step number badge */}
                <div className="absolute -top-4 -left-4 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="mb-4 sm:mb-6">
                  <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <Icon className="text-primary" size={32} aria-hidden="true" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base font-light">
                  {step.description}
                </p>

                {/* Arrow connector (hidden on mobile and last item) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-gray-300">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        d="M5 12H19M19 12L12 5M19 12L12 19"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-10 sm:mt-12">
          <button
            onClick={() => navigate('/contact')}
            className="btn-primary px-8 py-4 min-h-[44px] text-base sm:text-lg"
          >
            Start Your Brand Journey
          </button>
        </div>
      </div>
    </section>
  );
}
