import { useState } from 'react';
import { Play } from 'lucide-react';
import VideoModal from './VideoModal';

interface Video {
  src: string;
  title: string;
  thumbnail?: string;
}

interface VideoGalleryProps {
  videos: Video[];
  title?: string;
  subtitle?: string;
}

export default function VideoGallery({ videos, title, subtitle }: VideoGalleryProps) {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
  };

  const handleCloseModal = () => {
    setSelectedVideo(null);
  };

  return (
    <div className="mb-10 sm:mb-12 md:mb-16">
      {title && (
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto font-light px-2">
              {subtitle}
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {videos.map((video, index) => (
          <button
            key={index}
            onClick={() => handleVideoClick(video)}
            className="group relative aspect-video bg-gray-900 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
            aria-label={`Play video: ${video.title}`}
          >
            {video.thumbnail ? (
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                <div className="text-center">
                  <Play size={48} className="mx-auto mb-2 text-white opacity-80" aria-hidden="true" />
                  <p className="text-white text-sm font-light px-4">{video.title}</p>
                </div>
              </div>
            )}
            
            {/* Play button overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
              <div className="bg-white rounded-full p-3 sm:p-4 opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300">
                <Play size={24} className="text-gray-900" aria-hidden="true" fill="currentColor" />
              </div>
            </div>

            {/* Video title overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 sm:p-4">
              <p className="text-white text-xs sm:text-sm font-semibold line-clamp-2">
                {video.title}
              </p>
            </div>
          </button>
        ))}
      </div>

      {selectedVideo && (
        <VideoModal
          videoSrc={selectedVideo.src}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
