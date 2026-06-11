interface ApplicationCuringProps {
  type: 'gel-polish' | 'builder-gels' | 'top-coats' | 'base-coats' | 'polygel-acrygel' | 'liquid-polygel' | 'liquids';
}

export default function ApplicationCuring({ type }: ApplicationCuringProps) {
  const content = {
    'gel-polish': {
      title: 'Application & Curing',
      items: [
        { label: 'Application', value: 'Apply thin, even layers', primary: false },
        { label: 'Cure in 48W UV/LED Lamp', value: '30–60 seconds', primary: true },
        { label: 'Note', value: '(Different lamps will result in different curing times)', primary: false },
      ],
    },
    'builder-gels': {
      title: 'Application & Curing',
      items: [
        { label: 'Application', value: 'Apply medium layers for optimal strength', primary: false },
        { label: 'Cure in 48W UV/LED Lamp', value: '60–90 seconds', primary: true },
        { label: 'Note', value: '(Different lamps will result in different curing times)', primary: false },
      ],
    },
    'top-coats': {
      title: 'Application & Curing',
      items: [
        { label: 'Cure in 48W UV/LED Lamp', value: '60-90 seconds (TPO-Free)', primary: true },
        { label: 'Note', value: '(Different lamps will result in different curing times)', primary: false },
        { label: 'Non-wipe finish', value: 'Allow 10 seconds cooling before touching', primary: false },
        { label: 'Wipe-off finish', value: 'Cleanse with solution after full cure', primary: false },
      ],
    },
    'base-coats': {
      title: 'Application & Curing',
      items: [
        { label: 'Application', value: 'Apply thin, even layer to prepared nail', primary: false },
        { label: 'Cure in 48W UV/LED Lamp', value: '30–60 seconds', primary: true },
        { label: 'Note', value: '(Different lamps will result in different curing times)', primary: false },
      ],
    },
    'polygel-acrygel': {
      title: 'Application & Curing',
      items: [
        { label: 'Application', value: 'Sculpt with slip solution for easy shaping', primary: false },
        { label: 'Cure in 48W UV/LED Lamp', value: '60–90 seconds', primary: true },
        { label: 'Note', value: '(Different lamps will result in different curing times)', primary: false },
        { label: 'Flash cure', value: 'Allowed for building layers', primary: false },
      ],
    },
    'liquid-polygel': {
      title: 'Application & Curing',
      items: [
        { label: 'Application', value: 'Brush on with slip solution for smooth application', primary: false },
        { label: 'Cure in 48W UV/LED Lamp', value: '60–90 seconds', primary: true },
        { label: 'Note', value: '(Different lamps will result in different curing times)', primary: false },
        { label: 'Flash cure', value: 'Allowed for building layers', primary: false },
      ],
    },
    'liquids': {
      title: 'Usage Instructions',
      items: [
        { label: 'Application', value: 'Follow product-specific instructions', primary: false },
        { label: 'Safety', value: 'Use in well-ventilated area', primary: false },
        { label: 'Storage', value: 'Keep tightly closed when not in use', primary: false },
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
            <span className={`text-sm text-gray-900 min-w-[140px] ${item.primary ? 'font-bold' : 'font-semibold'}`}>
              {item.label}:
            </span>
            <span className={`text-sm ${item.primary ? 'font-semibold text-gray-900' : 'font-light text-gray-600'}`}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
