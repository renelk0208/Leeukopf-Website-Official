import { useState, useEffect, useRef, useCallback } from 'react';
import { Instagram, ExternalLink, Play, X } from 'lucide-react';
import { getInstagramFallbackImages } from '../lib/instagram-fallback';

// Brand type
type Brand = 'leeukopf' | 'gelitup';

// Brand configurations
const BRAND_CONFIG = {
  leeukopf: {
    profile: 'leeukopf_laboratories',
    heading: 'See Leeukopf in Action',
    description: 'See the latest colour trends and behind the scenes colour mixing.',
  },
  gelitup: {
    profile: 'gelitup',
    heading: 'Follow GEL.IT.UP on Instagram',
    description: 'Discover the latest nail art trends and professional tips.',
  },
} as const;

// Grid classes - dynamic based on count
// Currently supports 4 tiles (2x2) and 8 tiles (2x4 on mobile, 4x2 on desktop)
// For other counts, defaults to 2-column responsive grid
function getGridClasses(count: number): string {
  if (count === 8) {
    // 8 items: 2x4 grid (2 cols, 4 rows) on mobile/tablet, 4x2 on desktop
    return 'grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6';
  }
  // Default: 2x2 for 4 items or any other count
  // For counts other than 4 or 8, this will create a 2-column grid that wraps
  return 'grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6';
}

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
  brand: string;
  items: InstagramItem[];
  error?: string;
}

type LoadState = 'idle' | 'loading' | 'loaded' | 'error';

// Skeleton loader component - dynamic count
interface SkeletonGridProps {
  count: number;
}

function SkeletonGrid({ count }: SkeletonGridProps) {
  return (
    <div className={getGridClasses(count)}>
      {Array.from({ length: count }).map((_, index) => (
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

// Fallback images for when Instagram feed is unavailable - removed, now using getInstagramFallbackImages()
// const FALLBACK_IMAGES = [...];

// Error fallback component with static images
interface ErrorFallbackProps {
  profile: string;
  profileUrl: string;
  brand: Brand;
  limit: number;
}

function ErrorFallback({ profile, profileUrl, brand, limit }: ErrorFallbackProps) {
  const fallbackImages = getInstagramFallbackImages(brand, limit);
  
  return (
    <>
      {/* Display fallback images in grid */}
      <div className={getGridClasses(limit)}>
        {fallbackImages.map((imageSrc, index) => (
          <a
            key={index}
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#1E90FF] focus:ring-offset-2 w-full"
            aria-label={`View sample ${index + 1} - Visit our Instagram @${profile}`}
          >
            <img
              src={imageSrc}
              alt={`Sample content ${index + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            {/* Instagram icon overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-white/90 rounded-full p-3">
                <Instagram size={32} className="text-pink-500" aria-hidden="true" />
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* CTA message */}
      <div className="text-center mt-8 sm:mt-10">
        <p className="text-gray-700 text-base sm:text-lg mb-6 font-light">
          Our live Instagram feed is temporarily unavailable.
          <br className="hidden sm:block" />
          {' '}Visit us on Instagram for the latest updates →{' '}
          <span className="font-medium text-gray-900">@{profile}</span>
        </p>
        <a
          href={profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 min-h-[44px]"
        >
          <Instagram size={20} className="mr-2" aria-hidden="true" />
          Follow @{profile}
          <ExternalLink size={16} className="ml-2" aria-hidden="true" />
        </a>
      </div>
    </>
  );
}

// Video/Media Modal component
interface MediaModalProps {
  post: InstagramItem;
  onClose: () => void;
  brandName: string;
}

function MediaModal({ post, onClose, brandName }: MediaModalProps) {
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
              aria-label={post.caption || `Instagram video from ${brandName}`}
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <img
              src={post.imageUrl}
              alt={post.caption || `Instagram post from ${brandName}`}
              width={800}
              height={800}
              className="w-full h-full object-contain"
              decoding="async"
            />
          )}
        </div>

        {/* Caption and link to Instagram */}
        <div className="p-4 bg-gray-900">
          <h2 
            id="modal-title" 
            className={post.caption ? "text-gray-300 text-sm mb-3 line-clamp-3" : "sr-only"}
          >
            {post.caption || `Instagram Media from ${brandName}`}
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
  brandName: string;
}

function PostTile({ post, onSelect, brandName }: PostTileProps) {
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
          alt={post.caption || `Instagram post from ${brandName}`}
          width={400}
          height={400}
          className="w-full h-full object-contain bg-gray-50"
          loading="lazy"
          decoding="async"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
          <Instagram 
            size={48} 
            className="text-gray-500 group-hover:text-pink-500 transition-colors duration-300" 
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
interface InstagramFeedProps {
  brand?: Brand;
  limit?: number;
}

export default function InstagramFeed({ brand = 'leeukopf', limit = 4 }: InstagramFeedProps) {
  const [loadState, setLoadState] = useState<LoadState>('idle');
  const [posts, setPosts] = useState<InstagramItem[]>([]);
  const [selectedPost, setSelectedPost] = useState<InstagramItem | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const hasLoaded = useRef(false);

  // Get brand configuration
  const config = BRAND_CONFIG[brand];
  const profileUrl = `https://www.instagram.com/${config.profile}/`;
  const brandDisplayName = brand === 'leeukopf' ? 'Leeukopf Laboratories' : 'GEL.IT.UP';

  // Load Instagram feed data from API
  const loadFeed = useCallback(async () => {
    if (hasLoaded.current) return;
    hasLoaded.current = true;
    
    setLoadState('loading');
    
    try {
      // Fetch from /api/instagram endpoint with brand parameter (REQUIRED)
      const response = await fetch(`/api/instagram?brand=${brand}`);
      
      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      const data: InstagramApiResponse = await response.json();
      
      // If API returned an error message, log it and show error state
      if (data.error) {
        console.warn(`[instagram-feed] ${brand}:`, data.error);
        setLoadState('error');
        return;
      }
      
      // Check if we have items
      if (!data.items || data.items.length === 0) {
        console.warn(`[instagram-feed] ${brand}: No items returned`);
        setLoadState('error');
        return;
      }

      // Limit the number of posts to display to exactly 'limit'
      const displayItems = data.items.slice(0, limit);
      setPosts(displayItems);
      setLoadState('loaded');
    } catch (error) {
      console.error(`[instagram-feed] ${brand}: Failed to load Instagram feed:`, error);
      setLoadState('error');
    }
  }, [brand, limit]);

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
  }, [loadState, loadFeed]); // limit not needed in deps since loadFeed is memoized with brand

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
              {config.heading}
            </h2>
            <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-light px-2">
              {config.description}
            </p>
          </div>

          {/* Content area */}
          <div className="min-h-[200px]">
            {loadState === 'idle' || loadState === 'loading' ? (
              <SkeletonGrid count={limit} />
            ) : loadState === 'error' ? (
              <ErrorFallback profile={config.profile} profileUrl={profileUrl} brand={brand} limit={limit} />
            ) : (
              <>
                <div className={getGridClasses(limit)}>
                  {/* Render actual posts */}
                  {posts.map((post) => (
                    <PostTile key={post.id} post={post} onSelect={openModal} brandName={brandDisplayName} />
                  ))}
                  {/* Render placeholders for remaining slots (up to limit - posts.length) */}
                  {posts.length < limit && getInstagramFallbackImages(brand, limit - posts.length).map((imageSrc, index) => (
                    <a
                      key={`placeholder-${index}`}
                      href={profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#1E90FF] focus:ring-offset-2 w-full"
                      aria-label={`Visit our Instagram @${config.profile}`}
                    >
                      <img
                        src={imageSrc}
                        alt={`Sample content ${index + 1}`}
                        width={300}
                        height={300}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                      {/* Instagram icon overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-white/90 rounded-full p-3">
                          <Instagram size={32} className="text-pink-500" aria-hidden="true" />
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
                {/* CTA to visit Instagram profile */}
                <div className="text-center mt-8 sm:mt-10">
                  <a
                    href={profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-pink-500 hover:text-pink-600 transition-all duration-300 min-h-[44px]"
                  >
                    <Instagram size={20} className="mr-2" aria-hidden="true" />
                    Follow @{config.profile}
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
        <MediaModal post={selectedPost} onClose={closeModal} brandName={brandDisplayName} />
      )}
    </>
  );
}
