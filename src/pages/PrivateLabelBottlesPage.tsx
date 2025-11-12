import { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import PageTemplate from '../components/PageTemplate';

interface BottleProduct {
  id: string;
  name: string;
  spec: string;
  images: string[];
}

const BOTTLES: BottleProduct[] = [
  {
    id: 'dh-113a',
    name: 'DH-113A',
    spec: '9ml • 27.30mm × 46.50mm',
    images: [
      '/1280x1280_bottles_DH-113A copy.jpg',
      '/1280x1280_bottles_DH-113A.jpg'
    ]
  },
  {
    id: 'dh-227',
    name: 'DH-227',
    spec: '9ml • 36.30mm × 44.90mm',
    images: [
      '/1280x1280_bottles_DH-227 copy.jpg',
      '/1280x1280_bottles_DH-227.jpg'
    ]
  },
  {
    id: 'dh-430',
    name: 'DH-430',
    spec: '5ml • 20.90mm × 44.70mm',
    images: [
      '/1280x1280_bottles_DH-430 copy.jpg',
      '/1280x1280_bottles_DH-430.jpg'
    ]
  },
  {
    id: 'dh-918',
    name: 'DH-918',
    spec: '11ml • 32.40mm × 55.30mm',
    images: [
      '/1280x1280_bottles_DH-918 copy.jpg',
      '/1280x1280_bottles_DH-918.jpg'
    ]
  },
  {
    id: 'dh-1115',
    name: 'DH-1115',
    spec: '10ml • 32.70mm × 45.60mm',
    images: [
      '/1280x1280_bottles_DH-1115 copy.jpg',
      '/1280x1280_bottles_DH-1115.jpg'
    ]
  },
  {
    id: 'dh-1576',
    name: 'DH-1576',
    spec: '11ml • 37.50mm × 46.40mm',
    images: [
      '/1280x1280_bottles_DH-1576 copy.jpg',
      '/1280x1280_bottles_DH-1576.jpg'
    ]
  },
  {
    id: 'dh-1622',
    name: 'DH-1622',
    spec: '7ml • 22.80mm × 46.80mm',
    images: [
      '/1280x1280_bottles_DH-1622 copy.jpg',
      '/1280x1280_bottles_DH-1622.jpg'
    ]
  },
  {
    id: 'dh-1861',
    name: 'DH-1861',
    spec: '11ml • 26.70mm × 46.20mm',
    images: [
      '/1280x1280_bottles_DH-1861 copy.jpg',
      '/1280x1280_bottles_DH-1861.jpg'
    ]
  },
  {
    id: 'dh-2830',
    name: 'DH-2830',
    spec: '12ml • 36.00mm × 51.10mm',
    images: [
      '/1280x1280_bottles_DH-2830 copy.jpg',
      '/1280x1280_bottles_DH-2830.jpg'
    ]
  },
  {
    id: 'dh-3346',
    name: 'DH-3346',
    spec: '11ml • 41.00mm × 49.00mm',
    images: [
      '/1280x1280_bottles_DH-3346 copy.jpg',
      '/1280x1280_bottles_DH-3346.jpg',
      '/1280x1280_bottles_DH-3346 copy copy copy.jpg'
    ]
  },
  {
    id: 'dh-4284',
    name: 'DH-4284',
    spec: '13ml • 32.00mm × 53.50mm',
    images: [
      '/1280x1280_bottles_DH-4284 copy copy.jpg',
      '/1280x1280_bottles_DH-4284.jpg'
    ]
  },
  {
    id: 'dh-9a-8ml',
    name: 'DH-9A',
    spec: '8ml • 23.44mm × 77.03mm',
    images: [
      '/1280x1280_DH_8ml copy copy.jpg',
      '/1280x1280_DH_8ml.jpg'
    ]
  },
  {
    id: 'dh-9a-11ml',
    name: 'DH-9A',
    spec: '11ml • 29.31mm × 89.32mm',
    images: [
      '/1280x1280_DH_11ml copy copy.jpg',
      '/1280x1280_DH_11ml.jpg',
      '/1280x1280_DH-9A copy copy.jpg'
    ]
  },
  {
    id: 'dh-31',
    name: 'DH-31',
    spec: '7ml • 19.97mm × 70.33mm',
    images: [
      '/1280x1280_DH-31_7ml copy.jpg',
      '/1280x1280_DH-31_7ml.jpg'
    ]
  },
  {
    id: 'dh-93a',
    name: 'DH-93A',
    spec: '8ml • 23.44mm × 55.28mm',
    images: [
      '/1280x1280_DH-93A_8ml copy.jpg',
      '/1280x1280_DH-93A_8ml.jpg'
    ]
  },
  {
    id: 'dh-113',
    name: 'DH-113',
    spec: '10ml • 27.21mm × 75.44mm',
    images: [
      '/1280x1280_DH-113_10ml copy.jpg',
      '/1280x1280_DH-113_10ml.jpg'
    ]
  },
  {
    id: 'dh-134',
    name: 'DH-134',
    spec: '15ml • 32.60mm × 68.50mm',
    images: [
      '/1280x1280_DH-134 (1) copy.jpg',
      '/1280x1280_DH-134 (1).jpg',
      '/1280x1280_DH-134.jpg'
    ]
  },
  {
    id: 'dh-1294a',
    name: 'DH-1294A',
    spec: '13ml • 32.60mm × 47.70mm',
    images: [
      '/1280x1280_DH-1294A_13ml.jpg'
    ]
  },
  {
    id: 'dh-1716',
    name: 'DH-1716',
    spec: '12ml • 31.00mm × 58.00mm',
    images: [
      '/1280x1280_DH-1716.jpg'
    ]
  },
  {
    id: 'dh-1882',
    name: 'DH-1882',
    spec: '9ml • 25.00mm × 62.00mm',
    images: [
      '/1280x1280_DH-1882_9ml.jpg'
    ]
  },
  {
    id: 'dh-439',
    name: 'DH-439',
    spec: '10ml • 28.00mm × 65.00mm',
    images: [
      '/1280x1280_DH-439.jpg'
    ]
  },
  {
    id: 'dh-459',
    name: 'DH-459',
    spec: '11ml • 30.00mm × 64.00mm',
    images: [
      '/1280x1280_DH-459 (1).jpg'
    ]
  },
  {
    id: 'dh-489',
    name: 'DH-489',
    spec: '12ml • 32.00mm × 66.00mm',
    images: [
      '/1280x1280_DH-489.jpg'
    ]
  }
];

export default function PrivateLabelBottlesPage() {
  const [selectedBottle, setSelectedBottle] = useState<BottleProduct | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const currentImage = selectedBottle?.images[currentImageIndex];

  const openModal = (bottle: BottleProduct, imageIndex = 0) => {
    setSelectedBottle(bottle);
    setCurrentImageIndex(imageIndex);
    setIsZoomed(false);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedBottle(null);
    setIsZoomed(false);
    document.body.style.overflow = 'unset';
  };

  const nextImage = useCallback(() => {
    if (!selectedBottle) return;
    setCurrentImageIndex((prev) =>
      prev === selectedBottle.images.length - 1 ? 0 : prev + 1
    );
    setIsZoomed(false);
  }, [selectedBottle]);

  const prevImage = useCallback(() => {
    if (!selectedBottle) return;
    setCurrentImageIndex((prev) =>
      prev === 0 ? selectedBottle.images.length - 1 : prev - 1
    );
    setIsZoomed(false);
  }, [selectedBottle]);

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextImage();
      } else {
        prevImage();
      }
    }
    setTouchStart(null);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedBottle) return;

      if (e.key === 'Escape') {
        closeModal();
      } else if (e.key === 'ArrowLeft') {
        prevImage();
      } else if (e.key === 'ArrowRight') {
        nextImage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedBottle, nextImage, prevImage]);

  useEffect(() => {
    if (selectedBottle && currentImageIndex < selectedBottle.images.length - 1) {
      const nextImg = new Image();
      nextImg.src = selectedBottle.images[currentImageIndex + 1];
    }
  }, [selectedBottle, currentImageIndex]);

  return (
    <PageTemplate
      title="Private Label Bottles"
      subtitle="Premium gel polish bottles available for custom branding. Multiple sizes and finishes to match your brand aesthetic."
      breadcrumbs={[
        { label: 'Home', path: '/' },
        { label: 'Private Label', path: '/private-label' },
        { label: 'Bottles' }
      ]}
    >
      <div className="space-y-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {BOTTLES.map((bottle) => (
            <div
              key={bottle.id}
              onClick={() => openModal(bottle)}
              className="group cursor-pointer bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="aspect-square bg-gray-50 relative overflow-hidden">
                <img
                  src={bottle.images[0]}
                  alt={bottle.name}
                  loading="lazy"
                  className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">{bottle.name}</h3>
                <p className="text-sm text-gray-600 font-light">{bottle.spec}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-6">
            <button className="px-8 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors">
              Request Bottle Specs (PDF)
            </button>
            <button className="px-8 py-3 bg-white border-2 border-primary-600 text-primary-600 font-semibold rounded-lg hover:bg-primary-50 transition-colors">
              Get Pricing
            </button>
          </div>
          <p className="text-center text-sm text-gray-600 font-light">
            Available options: Caps (black/white/silver) • Brush types • Finish (glossy/matte)
          </p>
        </div>
      </div>

      {selectedBottle && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          role="dialog"
          aria-modal="true"
          aria-label="Image carousel"
        >
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 z-10 p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <X size={24} className="text-gray-700" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleZoom();
            }}
            className="absolute top-4 right-20 z-10 p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
            aria-label={isZoomed ? "Zoom out" : "Zoom in"}
          >
            {isZoomed ? (
              <ZoomOut size={24} className="text-gray-700" />
            ) : (
              <ZoomIn size={24} className="text-gray-700" />
            )}
          </button>

          {selectedBottle.images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft size={32} className="text-gray-700" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                aria-label="Next image"
              >
                <ChevronRight size={32} className="text-gray-700" />
              </button>
            </>
          )}

          <div
            className="max-w-5xl w-full max-h-[80vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`relative bg-white rounded-lg overflow-hidden mb-4 ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}>
              <img
                src={currentImage}
                alt={`${selectedBottle.name} - Image ${currentImageIndex + 1}`}
                className={`max-h-[70vh] w-auto transition-transform duration-300 ${isZoomed ? 'scale-150' : 'scale-100'}`}
                onClick={toggleZoom}
              />
            </div>

            <div className="bg-white rounded-lg px-6 py-3 mb-4">
              <h3 className="text-xl font-semibold text-gray-900 text-center">{selectedBottle.name}</h3>
              <p className="text-sm text-gray-600 font-light text-center">{selectedBottle.spec}</p>
            </div>

            {selectedBottle.images.length > 1 && (
              <div className="flex gap-2 bg-white rounded-lg p-3">
                {selectedBottle.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentImageIndex(idx);
                      setIsZoomed(false);
                    }}
                    className={`w-16 h-16 rounded border-2 overflow-hidden transition-all duration-300 ${
                      idx === currentImageIndex
                        ? 'border-primary-600 ring-2 ring-primary-200'
                        : 'border-gray-300 hover:border-primary-400 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer'
                    }`}
                    aria-label={`View image ${idx + 1}`}
                  >
                    <img
                      src={img}
                      alt={`${selectedBottle.name} thumbnail ${idx + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </PageTemplate>
  );
}
