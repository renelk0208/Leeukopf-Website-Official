import { useEffect } from 'react';
import { X } from 'lucide-react';

interface VideoModalProps {
  videoSrc: string;
  isYouTube?: boolean;
  onClose: () => void;
}

export default function VideoModal({ videoSrc, isYouTube = false, onClose }: VideoModalProps) {
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

      <div className="w-full max-w-5xl aspect-video">
        {isYouTube ? (
          <iframe
            src={videoSrc}
            className="w-full h-full"
            allow="autoplay; encrypted-media"
            allowFullScreen
            title="Video player"
          />
        ) : (
          <video
            src={videoSrc}
            controls
            autoPlay
            muted
            className="w-full h-full"
          >
            Your browser does not support the video tag.
          </video>
        )}
      </div>
    </div>
  );
}
