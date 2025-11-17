import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageTemplate from '../components/PageTemplate';
import VideoModal from '../components/VideoModal';
import { Play } from 'lucide-react';

export default function ProductsPage() {
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<{ src: string; isYouTube: boolean }>({ src: '', isYouTube: false });
  const categories = [
    {
      title: 'Gel Polish',
      description: 'Professional gel polish systems including French Collection, Solid Colours, Glitters, and complete Tops, Bases & Primers range.',
      path: '/products/gel-polish',
      image: '/img/products/gel_polish_category_1.jpg'
    },
    {
      title: 'Builder Systems',
      description: 'Advanced builder gels including 3-in-1 systems, fibreglass reinforcement, acrylics, and innovative polygel formulations.',
      path: '/products/builder-systems',
      image: '/img/products/builder_gels_category_2.jpg'
    },
    {
      title: 'Tops, Bases & Primers',
      description: 'Complete foundation and finishing systems including wipe-off and non-wipe tops, superior bases, and professional primers.',
      path: '/products/tops-bases-primers',
      image: '/img/products/tops & bases_category_1.jpg'
    }
  ];

  const mixingVideos = [
    {
      src: "/videos/mixing/video1.mp4",
      title: "Deep Red Pigment Blend",
      description:
        "Highly pigmented red gel polish being mixed to a perfectly smooth consistency under strict EU-regulated conditions."
    },
    {
      src: "/videos/mixing/video2.mp4",
      title: "Nude Base Adjustment",
      description:
        "Fine-tuning our nude gel base for flawless coverage while following all factory safety and quality protocols."
    },
    {
      src: "/videos/mixing/video3.mp4",
      title: "Violet Concentrate Pouring",
      description:
        "A behind-the-scenes look at precision pouring of violet concentrate to achieve intense colour with stable viscosity."
    },
    {
      src: "/videos/mixing/video4.mp4",
      title: "Cool-Tone Balancing",
      description:
        "Balancing cool pigments to keep tone consistent from batch to batch, fully aligned with current EU cosmetic regulations."
    },
    {
      src: "/videos/mixing/video5.mp4",
      title: "Warm Beige Formula Blend",
      description:
        "Mixing a warm beige creamy gel using high-grade raw materials in a controlled, safe production environment."
    },
    {
      src: "/videos/mixing/video6.mp4",
      title: "High-Coverage Black Mixing",
      description:
        "Our intensely pigmented black gel polish going through a slow blend process that minimises micro-bubbles and ensures opacity."
    },
    {
      src: "/videos/mixing/video7.mp4",
      title: "Shimmer Suspension Test",
      description:
        "Ensuring shimmer pigments stay evenly suspended in the gel while meeting all EU cosmetic safety standards."
    },
    {
      src: "/videos/mixing/video8.mp4",
      title: "Final Quality Check",
      description:
        "Final verification of texture, opacity, and stability of each batch, carried out under strict factory safety procedures."
    }
  ];

  const openVideo = (videoSrc: string, isYouTube: boolean) => {
    setCurrentVideo({ src: videoSrc, isYouTube });
    setVideoModalOpen(true);
  };

  return (
    <PageTemplate
      title="Our Products"
      subtitle="Professional nail care systems designed for perfection. From gel polish to builder systems, explore our complete range."
      breadcrumbs={[
        { label: 'Home', path: '/' },
        { label: 'Our Products' }
      ]}
      showCTA={true}
      ctaText="Request Product Catalogue"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {categories.map((category) => (
          <Link
            key={category.path}
            to={category.path}
            className="group block p-8 bg-white rounded-lg border border-gray-200 hover:border-blue-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
          >
            <div className="aspect-square bg-gray-100 rounded-lg mb-6 border border-gray-200 group-hover:border-blue-500 transition-colors overflow-hidden flex items-center justify-center">
              {category.image ? (
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover"
                />
              ) : null}
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3 group-hover:text-blue-800 transition-colors">
              {category.title}
            </h3>
            <p className="text-gray-600 font-light leading-relaxed">
              {category.description}
            </p>
            <div className="mt-4 text-blue-800 font-semibold group-hover:text-blue-900">
              Explore Collection →
            </div>
          </Link>
        ))}
      </div>

      <div className="bg-gray-50 rounded-lg p-8 border border-gray-200 mb-16">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Why Our Products Stand Out</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl mb-4">💎</div>
            <h3 className="font-semibold text-gray-900 mb-2">Premium Quality</h3>
            <p className="text-sm text-gray-600 font-light">Formulated with the finest ingredients for exceptional performance and durability.</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="font-semibold text-gray-900 mb-2">Extensive Range</h3>
            <p className="text-sm text-gray-600 font-light">From classic shades to trendy colors, we offer complete product ecosystems.</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="font-semibold text-gray-900 mb-2">Professional Grade</h3>
            <p className="text-sm text-gray-600 font-light">Trusted by nail technicians worldwide for salon-quality results.</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-8 border border-gray-200">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">Colour Mixing — Behind the Scenes</h2>
          <p className="text-gray-600 font-light">Watch how we create perfect shades in our state-of-the-art laboratory.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mixingVideos.map((video, index) => (
            <div
              key={index}
              className="group relative cursor-pointer rounded-lg overflow-hidden bg-gray-100 hover:shadow-xl transition-all duration-300"
              onClick={() => openVideo(video.src, false)}
            >
              <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-blue-800 bg-opacity-90 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Play size={28} className="text-white ml-1" fill="white" />
                  </div>
                </div>
                <span className="text-gray-400 text-sm">Video Placeholder</span>
              </div>
              <div className="p-4 bg-white">
                <h3 className="font-semibold text-gray-900 mb-2">{video.title}</h3>
                <p className="text-sm text-gray-600 font-light">{video.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {videoModalOpen && (
        <VideoModal
          videoSrc={currentVideo.src}
          isYouTube={currentVideo.isYouTube}
          onClose={() => setVideoModalOpen(false)}
        />
      )}
    </PageTemplate>
  );
}
