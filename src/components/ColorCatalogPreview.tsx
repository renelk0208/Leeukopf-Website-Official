import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

type Finish = 'Cream' | 'Shimmer' | 'Glitter' | 'Holographic';
type Mood = 'Nude' | 'Dark' | 'Seasonal';
type Filter = 'All' | Finish | Mood;

interface Shade {
  name: string;
  finish: Finish;
  mood?: Mood;
  hex: string;
}

const filters: Filter[] = ['All', 'Cream', 'Shimmer', 'Glitter', 'Holographic', 'Nude', 'Dark', 'Seasonal'];

const featuredShades: Shade[] = [
  { name: 'Porcelain Petal', finish: 'Cream', mood: 'Nude', hex: '#F3DDD2' },
  { name: 'Milk Rose', finish: 'Cream', mood: 'Nude', hex: '#F0CFC7' },
  { name: 'Latte Veil', finish: 'Cream', mood: 'Nude', hex: '#D8B39A' },
  { name: 'Sand Linen', finish: 'Cream', mood: 'Nude', hex: '#C9A78D' },
  { name: 'Bare Almond', finish: 'Cream', mood: 'Nude', hex: '#C99280' },
  { name: 'Cloud Taupe', finish: 'Cream', mood: 'Nude', hex: '#A68D7A' },
  { name: 'Toffee Silk', finish: 'Cream', mood: 'Nude', hex: '#A67861' },
  { name: 'Muted Mocha', finish: 'Cream', mood: 'Nude', hex: '#815D4B' },
  { name: 'Soft Merlot', finish: 'Cream', mood: 'Dark', hex: '#6D2F44' },
  { name: 'Berry Atelier', finish: 'Cream', mood: 'Dark', hex: '#7A1F47' },
  { name: 'Red Velvet Line', finish: 'Cream', mood: 'Dark', hex: '#8C1834' },
  { name: 'Classic Carmine', finish: 'Cream', mood: 'Dark', hex: '#A60F2D' },
  { name: 'Ink Noir', finish: 'Cream', mood: 'Dark', hex: '#1D1B24' },
  { name: 'Graphite Suit', finish: 'Cream', mood: 'Dark', hex: '#363742' },
  { name: 'Blue Caviar', finish: 'Cream', mood: 'Dark', hex: '#1F395B' },
  { name: 'Forest Patent', finish: 'Cream', mood: 'Dark', hex: '#23493B' },
  { name: 'Rose Quartz Light', finish: 'Shimmer', hex: '#D7AAB2' },
  { name: 'Champagne Dust', finish: 'Shimmer', hex: '#D5B587' },
  { name: 'Pearl Blush', finish: 'Shimmer', mood: 'Nude', hex: '#E3C8C1' },
  { name: 'Moon Beige', finish: 'Shimmer', mood: 'Nude', hex: '#BFA189' },
  { name: 'Bronze Whisper', finish: 'Shimmer', hex: '#976D4A' },
  { name: 'Amethyst Silk', finish: 'Shimmer', mood: 'Dark', hex: '#5E4B7D' },
  { name: 'Icy Lilac Flash', finish: 'Shimmer', mood: 'Seasonal', hex: '#AFA6DC' },
  { name: 'Seafoam Gleam', finish: 'Shimmer', mood: 'Seasonal', hex: '#80C9BE' },
  { name: 'Ruby Spark Rain', finish: 'Glitter', mood: 'Dark', hex: '#91213D' },
  { name: 'Platinum Snow', finish: 'Glitter', mood: 'Seasonal', hex: '#B3B8C5' },
  { name: 'Gold Party', finish: 'Glitter', mood: 'Seasonal', hex: '#B78A31' },
  { name: 'Peach Confetti', finish: 'Glitter', mood: 'Seasonal', hex: '#D89E80' },
  { name: 'Night Starfall', finish: 'Glitter', mood: 'Dark', hex: '#2A304A' },
  { name: 'Emerald Flare', finish: 'Glitter', mood: 'Dark', hex: '#2C705D' },
  { name: 'Coral Disco', finish: 'Glitter', mood: 'Seasonal', hex: '#D36F64' },
  { name: 'Fuchsia Rush', finish: 'Glitter', mood: 'Seasonal', hex: '#B53376' },
  { name: 'Prism Smoke', finish: 'Holographic', mood: 'Dark', hex: '#545A75' },
  { name: 'Silver Spectrum', finish: 'Holographic', mood: 'Seasonal', hex: '#A9AFBF' },
  { name: 'Opal Ice', finish: 'Holographic', mood: 'Seasonal', hex: '#B8CFE0' },
  { name: 'Sunset Prism', finish: 'Holographic', mood: 'Seasonal', hex: '#B87466' },
  { name: 'Aurora Mist', finish: 'Holographic', mood: 'Seasonal', hex: '#8DA9D6' },
  { name: 'Holo Orchid', finish: 'Holographic', mood: 'Seasonal', hex: '#9365A8' },
  { name: 'Cherry Glaze', finish: 'Cream', mood: 'Seasonal', hex: '#D3435C' },
  { name: 'Peony Bloom', finish: 'Cream', mood: 'Seasonal', hex: '#CF6A8A' },
  { name: 'Apricot Pop', finish: 'Cream', mood: 'Seasonal', hex: '#DE8657' },
  { name: 'Lemon Sorbet', finish: 'Cream', mood: 'Seasonal', hex: '#E5C65B' },
  { name: 'Mint Wave', finish: 'Cream', mood: 'Seasonal', hex: '#68B495' },
  { name: 'Sky Paint', finish: 'Cream', mood: 'Seasonal', hex: '#6E99D8' },
  { name: 'Lavender Milk', finish: 'Cream', mood: 'Seasonal', hex: '#A89BD8' },
  { name: 'Cocoa Plum', finish: 'Cream', mood: 'Dark', hex: '#68455A' },
  { name: 'Burgundy Frame', finish: 'Cream', mood: 'Dark', hex: '#5F2031' },
  { name: 'Olive Tailor', finish: 'Cream', mood: 'Dark', hex: '#5B6240' },
  { name: 'Charcoal Silk', finish: 'Shimmer', mood: 'Dark', hex: '#4A4B57' },
  { name: 'Espresso Glass', finish: 'Shimmer', mood: 'Dark', hex: '#5C4030' },
  { name: 'Rose Gold Stardust', finish: 'Glitter', mood: 'Seasonal', hex: '#B87074' },
  { name: 'Champagne Prism', finish: 'Holographic', mood: 'Nude', hex: '#CDB79A' },
];

export default function ColorCatalogPreview() {
  const [activeFilter, setActiveFilter] = useState<Filter>('All');

  const filteredShades = useMemo(() => {
    if (activeFilter === 'All') {
      return featuredShades;
    }

    return featuredShades.filter((shade) => shade.finish === activeFilter || shade.mood === activeFilter);
  }, [activeFilter]);

  return (
    <section className="mb-10 sm:mb-12 md:mb-16" aria-label="Color catalog">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">2,000+ Shades. All Ready to Brand.</h2>
        <p className="text-sm sm:text-base text-gray-600 max-w-3xl mx-auto">
          Browse our full catalog and request samples of any shade. New collections added regularly.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setActiveFilter(filter)}
            className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
              activeFilter === filter
                ? 'border-primary bg-primary text-white'
                : 'border-gray-300 bg-white text-gray-700 hover:border-primary hover:text-primary'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
        {filteredShades.map((shade) => (
          <article key={shade.name} className="rounded-xl border border-gray-200 bg-white p-3 sm:p-4">
            <div className="h-24 sm:h-28 rounded-lg border border-gray-100" style={{ backgroundColor: shade.hex }} />
            <div className="mt-3">
              <p className="text-sm font-semibold text-gray-900 leading-tight">{shade.name}</p>
              <div className="mt-2 flex items-center justify-between gap-2">
                <span className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
                  {shade.finish}
                </span>
                <Link
                  to={`/?shade=${encodeURIComponent(shade.name)}#quick-contact`}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Request this shade
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      <p className="mt-5 text-center text-sm text-gray-500">Full catalog available on request.</p>
    </section>
  );
}
