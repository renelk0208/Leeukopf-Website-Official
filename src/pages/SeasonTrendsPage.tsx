import { useState } from 'react';
import PageTemplate from '../components/PageTemplate';
import { Eye } from 'lucide-react';
import ImageLightbox from '../components/ImageLightbox';

export default function SeasonTrendsPage() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxImages, setLightboxImages] = useState<{ src: string; alt: string; caption?: string }[]>([]);

  const featuredPalette = [
    { color: '#8B4513', name: 'Burnt Sienna', caption: 'Warm earthy tone' },
    { color: '#2F4F4F', name: 'Deep Forest', caption: 'Rich evergreen' },
    { color: '#B22222', name: 'Crimson', caption: 'Bold statement red' },
    { color: '#DAA520', name: 'Goldenrod', caption: 'Luxe metallic' },
    { color: '#4B0082', name: 'Royal Indigo', caption: 'Deep jewel tone' },
    { color: '#708090', name: 'Slate', caption: 'Sophisticated neutral' },
  ];

  const lookbookImages = Array.from({ length: 12 }, (_, i) => ({
    src: `/img/season/aw/lookbook-${i + 1}.jpg`,
    alt: `Autumn/Winter Collection Look ${i + 1}`,
    caption: `Collection Look ${i + 1}`,
  }));

  const textures = [
    {
      title: 'Matte Velvet',
      description: 'Soft-touch finish with zero shine for an elegant, understated look.',
      image: '/img/season/aw/texture-matte.jpg',
    },
    {
      title: 'Metallic Shimmer',
      description: 'Subtle pearl finish that catches the light beautifully.',
      image: '/img/season/aw/texture-metallic.jpg',
    },
    {
      title: 'Glass Chrome',
      description: 'Mirror-like reflective finish for maximum impact.',
      image: '/img/season/aw/texture-chrome.jpg',
    },
  ];

  const openLightbox = (images: typeof lookbookImages, index: number) => {
    setLightboxImages(images);
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <PageTemplate
      title="Season Trends — Autumn/Winter"
      subtitle="Discover the colours, textures, and finishes defining this season."
      breadcrumbs={[
        { label: 'Home', path: '/' },
        { label: 'Season Trends' }
      ]}
      showCTA={true}
      ctaText="View All Colours"
      ctaLink="/products/gel-polish"
    >
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Featured Palette</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {featuredPalette.map((color, index) => (
            <div key={index} className="group cursor-pointer">
              <div
                className="aspect-square rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden"
                style={{ backgroundColor: color.color }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                  <Eye className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={24} />
                </div>
              </div>
              <div className="mt-3 text-center">
                <p className="font-semibold text-gray-900 text-sm">{color.name}</p>
                <p className="text-gray-600 text-xs mt-1">{color.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Lookbook</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {lookbookImages.map((image, index) => (
            <button
              key={index}
              className="group cursor-pointer bg-gray-100 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 text-left w-full"
              onClick={() => openLightbox(lookbookImages, index)}
              aria-label={`View ${image.alt}`}
            >
              <div className="aspect-[3/4] bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
                  <Eye className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={32} aria-hidden="true" />
                </div>
                <span className="text-gray-500 text-sm">Image Placeholder</span>
              </div>
              <div className="p-4 bg-white">
                <p className="text-sm text-gray-700">{image.caption}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Texture & Finishes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {textures.map((texture, index) => (
            <div key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                <span className="text-gray-500 text-sm">Image Placeholder</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{texture.title}</h3>
                <p className="text-gray-600 font-light text-sm leading-relaxed">{texture.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {lightboxOpen && (
        <ImageLightbox
          images={lightboxImages}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </PageTemplate>
  );
}
