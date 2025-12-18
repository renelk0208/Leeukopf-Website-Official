import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface VideoModalProps {
  videoSrc: string;
  isYouTube?: boolean;
  onClose: () => void;
}

export default function VideoModal({ videoSrc, isYouTube = false, onClose }: VideoModalProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  const handleVideoLoad = () => {
    setIsLoading(false);
  };

  const handleVideoError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
        aria-label="Close video"
      >
        <X size={32} aria-hidden="true" />
      </button>

      <div className="w-full max-w-5xl aspect-video relative">
        {isYouTube ? (
          <iframe
            src={videoSrc}
            className="w-full h-full"
            allow="autoplay; encrypted-media"
            allowFullScreen
            title="Video player"
          />
        ) : (
          <>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                  <p className="text-white text-sm">Loading video...</p>
                </div>
              </div>
            )}
            {hasError && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                <div className="text-center px-4">
                  <p className="text-white text-lg mb-2">Unable to load video</p>
                  <p className="text-gray-400 text-sm mb-2">The video file may be too large or in an unsupported format.</p>
                  <p className="text-gray-500 text-xs">Please check your internet connection and try refreshing the page.</p>
                </div>
              </div>
            )}
            <video
              src={videoSrc}
              controls
              muted
              preload="none"
              playsInline
              onLoadedData={handleVideoLoad}
              onError={handleVideoError}
              className="w-full h-full"
            >
              Your browser does not support the video tag.
            </video>
          </>
        )}
      </div>
    </div>
  );
}
