import { useState, useEffect } from 'react';
import { X, Instagram, Music2 } from 'lucide-react';
import PageTemplate from '../components/PageTemplate';

const INSTAGRAM_POST_URLS: string[] = [];
const TIKTOK_VIDEO_URLS: string[] = [];
const MAX_ITEMS = 12;

type Platform = 'instagram' | 'tiktok';
type FilterType = 'all' | 'instagram' | 'tiktok';

interface SocialPost {
  id: string;
  platform: Platform;
  url: string;
  embedUrl: string;
}

export default function LiveFeedPage() {
  const [filter, setFilter] = useState<FilterType>('all');
  const [embedsEnabled, setEmbedsEnabled] = useState(false);
  const [selectedPost, setSelectedPost] = useState<SocialPost | null>(null);
  const [scriptsLoaded, setScriptsLoaded] = useState({ instagram: false, tiktok: false });

  const posts: SocialPost[] = [
    ...INSTAGRAM_POST_URLS.slice(0, MAX_ITEMS).map((url, idx) => ({
      id: `ig-${idx}`,
      platform: 'instagram' as Platform,
      url,
      embedUrl: url
    })),
    ...TIKTOK_VIDEO_URLS.slice(0, MAX_ITEMS).map((url, idx) => ({
      id: `tt-${idx}`,
      platform: 'tiktok' as Platform,
      url,
      embedUrl: url
    }))
  ].slice(0, MAX_ITEMS);

  const filteredPosts = posts.filter(post =>
    filter === 'all' || post.platform === filter
  );

  useEffect(() => {
    const consent = localStorage.getItem('socialEmbedsConsent');
    if (consent === 'true') {
      setEmbedsEnabled(true);
    }
  }, []);

  useEffect(() => {
    if (embedsEnabled) {
      localStorage.setItem('socialEmbedsConsent', 'true');
    }
  }, [embedsEnabled]);

  const loadScript = (platform: Platform) => {
    if (scriptsLoaded[platform]) return;

    const script = document.createElement('script');
    script.defer = true;

    if (platform === 'instagram') {
      script.src = 'https://www.instagram.com/embed.js';
      script.onload = () => {
        setScriptsLoaded(prev => ({ ...prev, instagram: true }));
        if ((window as any).instgrm) {
          (window as any).instgrm.Embeds.process();
        }
      };
    } else {
      script.src = 'https://www.tiktok.com/embed.js';
      script.onload = () => {
        setScriptsLoaded(prev => ({ ...prev, tiktok: true }));
      };
    }

    document.body.appendChild(script);
  };

  const openModal = (post: SocialPost) => {
    if (!embedsEnabled) return;
    setSelectedPost(post);
    loadScript(post.platform);
  };

  const closeModal = () => {
    setSelectedPost(null);
  };

  const handleEnableEmbeds = () => {
    setEmbedsEnabled(true);
  };

  return (
    <PageTemplate
      title="Live: Instagram & TikTok"
      subtitle="Follow our journey and see the latest updates from our social channels."
      breadcrumbs={[
        { label: 'Home', path: '/' },
        { label: 'Live Feed' }
      ]}
    >
      <div className="space-y-8">
        <div className="flex flex-wrap gap-4 justify-center">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
          >
            <Instagram size={20} className="mr-2" />
            Follow on Instagram
          </a>
          <a
            href="https://tiktok.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-all duration-300"
          >
            <Music2 size={20} className="mr-2" />
            Follow on TikTok
          </a>
        </div>

        {!embedsEnabled && (
          <div className="bg-blue-50 border border-blue-500 rounded-lg p-6 text-center">
            <p className="text-gray-700 mb-4 font-light">
              Enable social embeds to view posts directly on this page. This will load content from Instagram and TikTok.
            </p>
            <button
              onClick={handleEnableEmbeds}
              className="px-6 py-2 bg-blue-800 text-white font-semibold rounded-lg hover:bg-blue-900 transition-colors"
            >
              Enable Social Embeds
            </button>
          </div>
        )}

        <div className="flex justify-center gap-2 border-b border-gray-200">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-3 font-semibold transition-colors ${
              filter === 'all'
                ? 'text-blue-800 border-b-2 border-blue-800'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('instagram')}
            className={`px-6 py-3 font-semibold transition-colors ${
              filter === 'instagram'
                ? 'text-blue-800 border-b-2 border-blue-800'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Instagram
          </button>
          <button
            onClick={() => setFilter('tiktok')}
            className={`px-6 py-3 font-semibold transition-colors ${
              filter === 'tiktok'
                ? 'text-blue-800 border-b-2 border-blue-800'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            TikTok
          </button>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📱</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">No posts yet</h3>
            <p className="text-gray-600 font-light mb-6">
              Follow us on social media to stay updated with our latest content.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-blue-600 hover:text-blue-800 transition-all duration-300"
              >
                <Instagram size={20} className="mr-2" />
                Visit Instagram
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-blue-600 hover:text-blue-800 transition-all duration-300"
              >
                <Music2 size={20} className="mr-2" />
                Visit TikTok
              </a>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPosts.map((post) => (
              <button
                key={post.id}
                className="group relative aspect-square bg-gray-100 rounded-lg border border-gray-200 overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 text-left w-full"
                onClick={() => embedsEnabled ? openModal(post) : undefined}
                aria-label={`View ${post.platform} post${embedsEnabled ? '' : ' - enable embeds first'}`}
                disabled={!embedsEnabled}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  {post.platform === 'instagram' ? (
                    <Instagram size={48} className="text-gray-400 group-hover:text-pink-500 transition-colors" aria-hidden="true" />
                  ) : (
                    <Music2 size={48} className="text-gray-400 group-hover:text-black transition-colors" aria-hidden="true" />
                  )}
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <span className="text-white text-sm font-semibold capitalize">
                    {post.platform}
                  </span>
                </div>
                {!embedsEnabled && (
                  <a
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/10 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 px-4 py-2 rounded-lg text-sm font-semibold">
                      View on {post.platform === 'instagram' ? 'Instagram' : 'TikTok'}
                    </span>
                  </a>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedPost && embedsEnabled && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div
            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Close modal"
            >
              <X size={24} className="text-gray-700" aria-hidden="true" />
            </button>
            <div className="p-8">
              {selectedPost.platform === 'instagram' ? (
                <blockquote
                  className="instagram-media"
                  data-instgrm-captioned
                  data-instgrm-permalink={selectedPost.embedUrl}
                  data-instgrm-version="14"
                />
              ) : (
                <blockquote
                  className="tiktok-embed"
                  cite={selectedPost.embedUrl}
                  data-video-id={selectedPost.embedUrl.split('/').pop()}
                >
                  <section>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={selectedPost.embedUrl}
                    >
                      View on TikTok
                    </a>
                  </section>
                </blockquote>
              )}
            </div>
          </div>
        </div>
      )}
    </PageTemplate>
  );
}
