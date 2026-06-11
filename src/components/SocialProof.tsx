const stats = [
  {
    value: '200+',
    label: 'Brands launched',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 19h16" />
        <path d="M8 19V9l4-4 4 4v10" />
      </svg>
    ),
  },
  {
    value: '2000+',
    label: 'Colors ready to brand',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 12a4 4 0 0 1 8 0" />
        <circle cx="9" cy="10" r="1" fill="currentColor" stroke="none" />
        <circle cx="15" cy="10" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    value: '17+',
    label: 'Countries served',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 0 20M12 2a15.3 15.3 0 0 0 0 20" />
      </svg>
    ),
  },
  {
    value: 'GMP',
    label: 'EU-certified facility',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
];

export default function SocialProof() {
  return (
    <section className="py-8 sm:py-12 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-10 md:gap-16">
          {stats.map((stat) => (
            <div key={stat.value} className="flex flex-col items-center gap-2 text-center">
              <div className="text-primary">{stat.icon}</div>
              <span className="text-3xl sm:text-4xl font-bold text-gray-900 leading-none">{stat.value}</span>
              <span className="text-sm sm:text-base text-gray-500 font-light">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
