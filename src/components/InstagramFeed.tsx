import { useState, useEffect, useRef, useCallback } from 'react';
import { Instagram, ExternalLink, AlertCircle, Play, X } from 'lucide-react';

// Configuration
const INSTAGRAM_PROFILE = 'leeukopf_laboratories';
const INSTAGRAM_PROFILE_URL = `https://www.instagram.com/${INSTAGRAM_PROFILE}/`;

// Number of posts to display in the grid (2x2 = 4)
const POST_COUNT = 4;

// Grid classes for 2x2 layout (responsive: 1 col mobile, 2 cols tablet+)
const GRID_CLASSES = 'grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6';

// Instagram post interface matching the /api/instagram response contract
interface InstagramItem {
  id: string;
  type: 'IMAGE' | 'VIDEO' | 'REEL' | 'CAROUSEL';
  imageUrl: string;
  videoUrl: string | null;
  permalink: string;
  caption: string | null;
  timestamp: string;
}

interface InstagramApiResponse {
  items: InstagramItem[];
  error: string | null;
}

type LoadState = 'idle' | 'loading' | 'loaded' | 'error';

// Skeleton loader component for 4 items (2x2 grid)
function SkeletonGrid() {
  return (
    <div className={GRID_CLASSES}>
      {Array.from({ length: POST_COUNT }).map((_, index) => (
        <div
          key={index}
          className="aspect-square bg-gray-200 rounded-lg animate-pulse"
          role="presentation"
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

// Error fallback component
function ErrorFallback() {
  return (
    <div className="text-center py-8 sm:py-12 px-4">
      <div className="flex justify-center mb-4">
        <AlertCircle size={48} className="text-gray-400" aria-hidden="true" />
      </div>
      <p className="text-gray-600 text-base sm:text-lg mb-6 font-light">
        Our live Instagram feed is not available right now.
        <br className="hidden sm:block" />
        {' '}Visit us on Instagram →{' '}
        <span className="font-medium text-gray-800">@{INSTAGRAM_PROFILE}</span>
      </p>
      <a
        href={INSTAGRAM_PROFILE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 min-h-[44px]"
      >
        <Instagram size={20} className="mr-2" aria-hidden="true" />
        Visit Our Instagram
        <ExternalLink size={16} className="ml-2" aria-hidden="true" />
      </a>
    </div>
  );
}

// Video/Media Modal component
interface MediaModalProps {
  post: InstagramItem;
  onClose: () => void;
}

function MediaModal({ post, onClose }: MediaModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const isVideo = post.type === 'VIDEO' || post.type === 'REEL';

  // Handle escape key and stop video on close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';

    // Capture videoRef.current for cleanup
    const videoElement = videoRef.current;

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      // Stop video when closing
      if (videoElement) {
        videoElement.pause();
        videoElement.currentTime = 0;
      }
    };
  }, [onClose]);

  // Focus trap - focus the modal on open
  useEffect(() => {
    modalRef.current?.focus();
  }, []);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className="relative bg-black rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden focus:outline-none"
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-2 bg-black/60 hover:bg-black/80 rounded-full transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Close modal"
        >
          <X size={24} className="text-white" aria-hidden="true" />
        </button>

        {/* Media content */}
        <div className="relative aspect-square sm:aspect-video bg-black flex items-center justify-center">
          {isVideo && post.videoUrl ? (
            <video
              ref={videoRef}
              src={post.videoUrl}
              className="w-full h-full object-contain"
              controls
              autoPlay
              playsInline
              aria-label={post.caption || 'Instagram video from Leeukopf Laboratories'}
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <img
              src={post.imageUrl}
              alt={post.caption || 'Instagram post from Leeukopf Laboratories'}
              className="w-full h-full object-contain"
            />
          )}
        </div>

        {/* Caption and link to Instagram */}
        <div className="p-4 bg-gray-900">
          <h2 
            id="modal-title" 
            className={post.caption ? "text-gray-300 text-sm mb-3 line-clamp-3" : "sr-only"}
          >
            {post.caption || 'Instagram Media from Leeukopf Laboratories'}
          </h2>
          <a
            href={post.permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-pink-400 hover:text-pink-300 text-sm font-medium transition-colors min-h-[44px]"
          >
            <Instagram size={16} className="mr-2" aria-hidden="true" />
            View on Instagram
            <ExternalLink size={14} className="ml-1" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  );
}

// Instagram post tile component
interface PostTileProps {
  post: InstagramItem;
  onSelect: (post: InstagramItem) => void;
}

function PostTile({ post, onSelect }: PostTileProps) {
  const [imageError, setImageError] = useState(false);
  const isVideo = post.type === 'VIDEO' || post.type === 'REEL';

  const handleClick = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    onSelect(post);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(post);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#1E90FF] focus:ring-offset-2 w-full"
      aria-label={`${isVideo ? 'Play video' : 'View image'}: ${post.caption || 'Instagram post'}`}
    >
      {post.imageUrl && !imageError ? (
        <img
          src={post.imageUrl}
          alt={post.caption || 'Instagram post from Leeukopf Laboratories'}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
          <Instagram 
            size={48} 
            className="text-gray-400 group-hover:text-pink-500 transition-colors duration-300" 
            aria-hidden="true" 
          />
        </div>
      )}

      {/* Play icon overlay for videos */}
      {isVideo && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-black/50 rounded-full p-3 group-hover:bg-black/70 transition-colors">
            <Play size={32} className="text-white fill-white" aria-hidden="true" />
          </div>
        </div>
      )}

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
    </button>
  );
}

// Main Instagram Feed component
export default function InstagramFeed() {
  const [loadState, setLoadState] = useState<LoadState>('idle');
  const [posts, setPosts] = useState<InstagramItem[]>([]);
  const [selectedPost, setSelectedPost] = useState<InstagramItem | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const hasLoaded = useRef(false);

  // Load Instagram feed data from API
  const loadFeed = useCallback(async () => {
    if (hasLoaded.current) return;
    hasLoaded.current = true;
    
    setLoadState('loading');
    
    try {
      // Fetch from /api/instagram endpoint
      const response = await fetch('/api/instagram');
      
      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      const data: InstagramApiResponse = await response.json();
      
      if (!data.items || data.items.length === 0) {
        // No items returned - show error state
        setLoadState('error');
        return;
      }

      setPosts(data.items);
      setLoadState('loaded');
    } catch (error) {
      console.error('Failed to load Instagram feed:', error);
      setLoadState('error');
    }
  }, []);

  // Set up IntersectionObserver for lazy loading
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && loadState === 'idle') {
          loadFeed();
        }
      },
      {
        root: null,
        rootMargin: '200px', // Start loading 200px before section enters viewport
        threshold: 0,
      }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, [loadState, loadFeed]);

  // Handle modal open/close
  const openModal = (post: InstagramItem) => {
    setSelectedPost(post);
  };

  const closeModal = () => {
    setSelectedPost(null);
  };

  return (
    <>
      <section
        ref={sectionRef}
        className="py-12 sm:py-16 md:py-20 bg-white/80 backdrop-blur-sm"
        aria-labelledby="instagram-feed-heading"
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2
              id="instagram-feed-heading"
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 tracking-tight"
            >
              See Leeukopf in Action
            </h2>
            <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-light px-2">
              See the latest colour trends and behind the scenes colour mixing.
            </p>
          </div>

          {/* Content area */}
          <div className="min-h-[200px]">
            {loadState === 'idle' || loadState === 'loading' ? (
              <SkeletonGrid />
            ) : loadState === 'error' ? (
              <ErrorFallback />
            ) : (
              <>
                <div className={GRID_CLASSES}>
                  {posts.map((post) => (
                    <PostTile key={post.id} post={post} onSelect={openModal} />
                  ))}
                </div>
                {/* CTA to visit Instagram profile */}
                <div className="text-center mt-8 sm:mt-10">
                  <a
                    href={INSTAGRAM_PROFILE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-pink-500 hover:text-pink-600 transition-all duration-300 min-h-[44px]"
                  >
                    <Instagram size={20} className="mr-2" aria-hidden="true" />
                    Follow @{INSTAGRAM_PROFILE}
                    <ExternalLink size={16} className="ml-2" aria-hidden="true" />
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Modal for viewing media */}
      {selectedPost && (
        <MediaModal post={selectedPost} onClose={closeModal} />
      )}
    </>
  );
}
