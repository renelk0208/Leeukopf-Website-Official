interface ApplicationCuringProps {
  type: 'gel-polish' | 'builder-gels' | 'top-coats' | 'base-coats' | 'polygel-acrygel' | 'acrylic-systems' | 'liquids';
}

export default function ApplicationCuring({ type }: ApplicationCuringProps) {
  const content = {
    'gel-polish': {
      title: 'Application & Curing',
      items: [
        { label: 'Application', value: 'Apply thin, even layers' },
        { label: 'LED Cure Time', value: '30–60 seconds' },
        { label: 'UV Cure Time', value: '120 seconds' },
      ],
    },
    'builder-gels': {
      title: 'Application & Curing',
      items: [
        { label: 'Application', value: 'Apply medium layers for optimal strength' },
        { label: 'LED Cure Time', value: '60–90 seconds' },
        { label: 'UV Cure Time', value: '120 seconds' },
      ],
    },
    'top-coats': {
      title: 'Application & Curing',
      items: [
        { label: 'LED Cure Time', value: '30–60 seconds' },
        { label: 'Non-wipe finish', value: 'Allow 10 seconds cooling before touching' },
        { label: 'Wipe-off finish', value: 'Cleanse with solution after full cure' },
      ],
    },
    'base-coats': {
      title: 'Application & Curing',
      items: [
        { label: 'Application', value: 'Apply thin, even layer to prepared nail' },
        { label: 'LED Cure Time', value: '30–60 seconds' },
      ],
    },
    'polygel-acrygel': {
      title: 'Application & Curing',
      items: [
        { label: 'Application', value: 'Sculpt with slip solution for easy shaping' },
        { label: 'LED Cure Time', value: '60–90 seconds' },
        { label: 'Flash cure', value: 'Allowed for building layers' },
      ],
    },
    'acrylic-systems': {
      title: 'Application & Curing',
      items: [
        { label: 'Important', value: 'Do not cure by lamp — acrylics cure by air' },
        { label: 'Standard-set', value: '3–5 minutes air dry' },
        { label: 'Fast-set', value: '2–3 minutes air dry' },
      ],
    },
    'liquids': {
      title: 'Usage Instructions',
      items: [
        { label: 'Application', value: 'Follow product-specific instructions' },
        { label: 'Safety', value: 'Use in well-ventilated area' },
        { label: 'Storage', value: 'Keep tightly closed when not in use' },
      ],
    },
  };

  const data = content[type];

  return (
    <div className="bg-gray-50 rounded-lg p-5 sm:p-6 md:p-8 border border-gray-200 mb-10 sm:mb-12 md:mb-16">
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">
        {data.title}
      </h2>
      <div className="space-y-3">
        {data.items.map((item, index) => (
          <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
            <span className="text-sm font-semibold text-gray-900 min-w-[140px]">
              {item.label}:
            </span>
            <span className="text-sm text-gray-600 font-light">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
