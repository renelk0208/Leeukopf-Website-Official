import { useState, useEffect, useRef, useCallback } from 'react';
import { Instagram, ExternalLink, AlertCircle } from 'lucide-react';

// Configuration
const INSTAGRAM_PROFILE = 'leeukopf_laboratories';
const INSTAGRAM_PROFILE_URL = `https://www.instagram.com/${INSTAGRAM_PROFILE}/`;

// Number of skeleton items to show while loading
const SKELETON_COUNT = 6;

// Placeholder posts - in production, these would come from an API
// Using placeholder data to demonstrate the UI structure
interface InstagramPost {
  id: string;
  permalink: string;
  mediaUrl: string;
  caption?: string;
  timestamp?: string;
}

// Placeholder post data - replace with actual API data when available
const PLACEHOLDER_POSTS: InstagramPost[] = [
  { id: '1', permalink: INSTAGRAM_PROFILE_URL, mediaUrl: '', caption: 'Instagram post' },
  { id: '2', permalink: INSTAGRAM_PROFILE_URL, mediaUrl: '', caption: 'Instagram post' },
  { id: '3', permalink: INSTAGRAM_PROFILE_URL, mediaUrl: '', caption: 'Instagram post' },
  { id: '4', permalink: INSTAGRAM_PROFILE_URL, mediaUrl: '', caption: 'Instagram post' },
  { id: '5', permalink: INSTAGRAM_PROFILE_URL, mediaUrl: '', caption: 'Instagram post' },
  { id: '6', permalink: INSTAGRAM_PROFILE_URL, mediaUrl: '', caption: 'Instagram post' },
];

type LoadState = 'idle' | 'loading' | 'loaded' | 'error';

// Skeleton loader component
function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
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
        Our live feed is not available right now.
        <br className="hidden sm:block" />
        {' '}See more on Instagram →{' '}
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

// Instagram post tile component
interface PostTileProps {
  post: InstagramPost;
}

function PostTile({ post }: PostTileProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <a
      href={post.permalink}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden block hover:shadow-lg hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#1E90FF] focus:ring-offset-2"
      aria-label={`View Instagram post: ${post.caption || 'Instagram post'}`}
    >
      {post.mediaUrl && !imageError ? (
        <img
          src={post.mediaUrl}
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
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
        <ExternalLink 
          size={24} 
          className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
          aria-hidden="true"
        />
      </div>
    </a>
  );
}

// Main Instagram Feed component
export default function InstagramFeed() {
  const [loadState, setLoadState] = useState<LoadState>('idle');
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  const hasLoaded = useRef(false);

  // Load Instagram feed data
  const loadFeed = useCallback(async () => {
    if (hasLoaded.current) return;
    hasLoaded.current = true;
    
    setLoadState('loading');
    
    try {
      // Simulate API call delay for demo purposes
      // In production, replace this with actual Instagram API/bridge endpoint call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // For now, use placeholder posts
      // In production, fetch from your Instagram API endpoint:
      // const response = await fetch('/api/instagram-feed');
      // const data = await response.json();
      // setPosts(data.posts);
      
      setPosts(PLACEHOLDER_POSTS);
      setLoadState('loaded');
    } catch {
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
        rootMargin: '100px', // Start loading 100px before section enters viewport
        threshold: 0,
      }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, [loadState, loadFeed]);

  return (
    <section
      ref={sectionRef}
      className="py-12 sm:py-16 md:py-20 bg-white/80 backdrop-blur-sm"
      aria-labelledby="instagram-feed-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h2
            id="instagram-feed-heading"
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 tracking-tight"
          >
            See Leeukopf in Action
          </h2>
          <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-light px-2">
            Live moments from our lab, products and behind the scenes.
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {posts.map((post) => (
                  <PostTile key={post.id} post={post} />
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
  );
}
