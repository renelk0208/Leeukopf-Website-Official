import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

const enablePwa = process.env.VITE_ENABLE_PWA === 'true';

// Black Friday menu button follows the same Netlify switch as the offer itself
// (BLACK_FRIDAY_ENABLED / BLACK_FRIDAY_ENDS_AT — see netlify/functions/black-friday-order.ts).
const bfFlag = (process.env.BLACK_FRIDAY_ENABLED ?? '').trim().toLowerCase();
const bfMenuEnabled = !['false', 'off', '0', 'no'].includes(bfFlag);
const bfEndsAt = (process.env.BLACK_FRIDAY_ENDS_AT ?? '').trim();

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    __BF_MENU_ENABLED__: JSON.stringify(bfMenuEnabled),
    __BF_ENDS_AT__: JSON.stringify(bfEndsAt),
  },
  plugins: [
    react(),
    ...(enablePwa
      ? [
          VitePWA({
      selfDestroying: true,
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'robots.txt'],
      manifest: {
        name: 'Leeukopf Laboratories - GMP Gel Polish Manufacturer',
        short_name: 'Leeukopf',
        description: 'Premium private label gel polish manufacturer in Bulgaria (EU). 2000+ colors, HEMA & TPO-free formulas, GMP-compliant production.',
        theme_color: '#0891b2',
        background_color: '#0f172a',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/icon-192-maskable.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: '/icons/icon-512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,svg,webp}'],
        // Increase limit to handle larger images (10MB)
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
        // Don't precache large images - they'll be cached on demand
        globIgnores: ['**/*.{png,jpg,jpeg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            // Cache images on demand
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              }
            }
          }
        ]
      },
      devOptions: {
        enabled: false
      }
    })
        ]
      : [])
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
        },
      }
    }
  }
});
