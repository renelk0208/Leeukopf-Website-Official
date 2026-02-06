import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import '../styles/valentines.css';

interface TextureVideo {
  src: string;
  label: string;
}

interface Pick {
  src: string;
  alt: string;
  caption: string;
  fallbackGradient: string;
}

const textureVideos: TextureVideo[] = [
  { src: '/seasonal/valentines/loops/pink-promise-1.mp4', label: 'Pink Promise' },
  { src: '/seasonal/valentines/loops/red-heart-1.mp4', label: 'Red Heart' },
  { src: '/seasonal/valentines/loops/scarlet-desire-1.mp4', label: 'Scarlet Desire' },
  { src: '/seasonal/valentines/loops/petal-crush-1.mp4', label: 'Petal Crush' },
  { src: '/seasonal/valentines/loops/powdered-rose-1.mp4', label: 'Powdered Rose' },
  { src: '/seasonal/valentines/loops/cupids-glow-1.mp4', label: "Cupid's Glow" },
  { src: '/seasonal/valentines/loops/blush-whisper-1.mp4', label: 'Blush Whisper' },
  { src: '/seasonal/valentines/loops/love-letter-1.mp4', label: 'Love Letter' },
];

const picks: Pick[] = [
  { src: '/seasonal/valentines/picks/red-heart-1.png', alt: 'Romantic Rose gel polish', caption: 'Romantic Rose', fallbackGradient: 'linear-gradient(135deg, #D81B60, #F06292)' },
  { src: '/seasonal/valentines/picks/passionate-pin-1.png', alt: 'Passionate Pink gel polish', caption: 'Passionate Pink', fallbackGradient: 'linear-gradient(135deg, #EC407A, #F8BBD0)' },
  { src: '/seasonal/valentines/picks/love-potion-1.png', alt: 'Love Potion gel polish', caption: 'Love Potion', fallbackGradient: 'linear-gradient(135deg, #C2185B, #E91E63)' },
  { src: '/seasonal/valentines/picks/berry-blush.png', alt: 'Berry Blush gel polish', caption: 'Berry Blush', fallbackGradient: 'linear-gradient(135deg, #AD1457, #EC407A)' },
  { src: '/seasonal/valentines/picks/sweet-heart-1.png', alt: 'Sweet Heart gel polish', caption: 'Sweet Heart', fallbackGradient: 'linear-gradient(135deg, #F48FB1, #FCE4EC)' },
  { src: '/seasonal/valentines/picks/petal-crush-7.png', alt: 'Ruby Romance gel polish', caption: 'Ruby Romance', fallbackGradient: 'linear-gradient(135deg, #880E4F, #D81B60)' },
  { src: '/seasonal/valentines/picks/champaigne-kiss-1.png', alt: 'Champagne Kiss gel polish', caption: 'Champagne Kiss', fallbackGradient: 'linear-gradient(135deg, #F8BBD0, #FFFFFF)' },
  { src: '/seasonal/valentines/picks/velvet-valentine-1.png', alt: 'Velvet Valentine gel polish', caption: 'Velvet Valentine', fallbackGradient: 'linear-gradient(135deg, #C51162, #F50057)' },
];

export default function ValentinesPage() {
  // Update page title and meta tags
  useEffect(() => {
    document.title = "Valentine's Collection 2026 - Leeukopf Laboratories";
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', "Discover our exclusive Valentine's Day 2026 gel polish collection. Premium colors perfect for celebrating love and romance.");
    }
    
    // Update og:title
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', "Valentine's Collection 2026 - Leeukopf Laboratories");
    }
    
    // Update og:description
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', "Discover our exclusive Valentine's Day 2026 gel polish collection. Premium colors perfect for celebrating love and romance.");
    }
    
    // Update og:url
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
      ogUrl.setAttribute('content', 'https://leeukopf.com/valentines');
    }
    
    // Cleanup: restore defaults on unmount
    return () => {
      document.title = 'Leeukopf Laboratories - Premium Gel Polish Manufacturing';
      if (metaDescription) {
        metaDescription.setAttribute('content', 'Premium private label gel polish manufacturer in Bulgaria. 3000+ colors, HEMA-free formulations, certified factory. Start your brand today.');
      }
    };
  }, []);

  useEffect(() => {
    // Configuration
    const CONFIG = {
      maxHearts: 20,
      spawnInterval: 700, // milliseconds
      heartSymbol: '❤',
      // Date range: Feb 6, 2026 00:00:00 to Feb 15, 2026 23:59:59 (local time)
      startDate: new Date(2026, 1, 6, 0, 0, 0), // Month is 0-indexed (1 = February)
      endDate: new Date(2026, 1, 15, 23, 59, 59)
    };

    // Check if hearts should be active
    function shouldShowHearts() {
      const now = new Date();
      return now >= CONFIG.startDate && now <= CONFIG.endDate;
    }

    // Check for reduced motion preference
    function prefersReducedMotion() {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    // Initialize hearts effect
    function initHearts() {
      // Early exit if outside date range or reduced motion preferred
      if (!shouldShowHearts() || prefersReducedMotion()) {
        return;
      }

      const container = document.getElementById('hearts-container');
      if (!container) return;

      let heartCount = 0;

      function createHeart() {
        // Limit number of hearts on screen
        if (heartCount >= CONFIG.maxHearts) {
          return;
        }

        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.textContent = CONFIG.heartSymbol;
        heart.setAttribute('aria-hidden', 'true');

        // Random horizontal position
        const leftPosition = Math.random() * 100;
        heart.style.left = leftPosition + '%';

        // Random size variation
        const size = 15 + Math.random() * 15; // 15-30px
        heart.style.fontSize = size + 'px';

        // Random duration (slower fall for variety)
        const duration = 8 + Math.random() * 4; // 8-12 seconds
        heart.style.animationDuration = duration + 's';

        // Slight horizontal drift
        const drift = -20 + Math.random() * 40; // -20 to 20px
        heart.style.setProperty('--drift', drift + 'px');

        container.appendChild(heart);
        heartCount++;

        // Remove heart after animation completes
        setTimeout(() => {
          if (heart.parentNode) {
            heart.parentNode.removeChild(heart);
            heartCount--;
          }
        }, duration * 1000);
      }

      // Spawn hearts at intervals
      const spawnInterval = setInterval(() => {
        // Stop spawning if outside date range
        if (!shouldShowHearts()) {
          clearInterval(spawnInterval);
          return;
        }
        createHeart();
      }, CONFIG.spawnInterval);

      // Initial hearts
      for (let i = 0; i < 5; i++) {
        setTimeout(() => createHeart(), i * 200);
      }

      // Cleanup function
      return () => {
        clearInterval(spawnInterval);
      };
    }

    const cleanup = initHearts();
    return cleanup;
  }, []);

  return (
    <>
      <Navigation />

      {/* Hearts Falling Container (only visible Feb 6-15, 2026) */}
      <div id="hearts-container" className="hearts-container" aria-hidden="true"></div>

      {/* Hero Section with Video Background */}
      <section className="hero-section">
        <video
          className="hero-video"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster="/seasonal/valentines/valentines-hero-poster.png"
          aria-label="Valentine's collection background video"
        >
          <source src="/seasonal/valentines/valentines-hero.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className="hero-overlay"></div>

        <div className="hero-content">
          <h1 className="hero-title">Love is in the Details</h1>
          <p className="hero-subtitle">Discover our exclusive Valentine's collection featuring romantic shades & lustrous finishes</p>
          <div className="hero-buttons">
            <a href="#top-picks" className="btn btn-primary">Shop Valentine's Picks</a>
            <a href="/products/gel-polish#solid-colour-collection" className="btn btn-secondary">View All Colors</a>
          </div>
        </div>
      </section>

      {/* Top Picks Section */}
      <section id="top-picks" className="section">
        <div className="container">
          <h2 className="section-title">Valentine's Top Picks</h2>
          <p className="section-subtitle">Our most romantic shades, perfect for celebrating love</p>
          <p className="text-center text-sm sm:text-base text-gray-600 italic mb-6">
            Glossy vs Matte - Each shade showcases both glossy and matte finishes
          </p>

          <div className="picks-grid">
            {picks.map((pick, index) => (
              <a key={index} href="/products/gel-polish#solid-colour-collection" className="pick-card">
                <img
                  src={pick.src}
                  alt={pick.alt}
                  className="pick-card-image"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.background = pick.fallbackGradient;
                  }}
                />
                <div className="pick-card-caption">{pick.caption}</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Explore by Mood Section */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Explore by Mood</h2>
          <p className="section-subtitle">Find the perfect shade for your Valentine's vibe</p>

          <div className="mood-blocks">
            {/* Mood Block 1: Bold & Passionate */}
            <div className="mood-block">
              <img
                src="/seasonal/valentines/picks/velvet-valentine-1.png"
                alt="Bold and passionate Valentine's looks"
                className="mood-image"
                loading="lazy"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.background = 'linear-gradient(135deg, #880E4F, #D81B60)';
                }}
              />
              <div className="mood-content">
                <h3 className="mood-title">Bold & Passionate</h3>
                <p className="mood-text">Deep reds and rich burgundies for dramatic statements</p>
                <a href="/products/gel-polish#solid-colour-collection" className="mood-link">Explore Bold Shades →</a>
              </div>
            </div>

            {/* Mood Block 2: Soft & Romantic */}
            <div className="mood-block">
              <img
                src="/seasonal/valentines/picks/sweet-heart-1.png"
                alt="Soft and romantic Valentine's looks"
                className="mood-image"
                loading="lazy"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.background = 'linear-gradient(135deg, #F8BBD0, #FCE4EC)';
                }}
              />
              <div className="mood-content">
                <h3 className="mood-title">Soft & Romantic</h3>
                <p className="mood-text">Delicate pinks and nudes for understated elegance</p>
                <a href="/products/gel-polish#solid-colour-collection" className="mood-link">Explore Soft Shades →</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Texture in Motion Section */}
      <section className="section texture-section">
        <div className="container texture-content">
          <h2 className="section-title">Texture in Motion</h2>
          <p className="section-subtitle">Experience the luxurious consistency of our gel polish</p>

          <div className="texture-grid">
            {textureVideos.map((video, index) => (
              <div key={index} className="texture-video-card">
                <video
                  className="texture-video"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  aria-label={`${video.label} gel polish texture demonstration`}
                >
                  <source src={video.src} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <div className="texture-label">{video.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="section cta-section">
        <div className="container">
          <h2 className="section-title">Ready to Create Magic?</h2>
          <p className="section-subtitle">Start your private label journey with our Valentine's collection</p>
          <Link to="/client-registration" className="btn btn-light">Get Started Today</Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
