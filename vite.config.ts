import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    ViteImageOptimizer({
      // Optimize PNG images
      png: {
        quality: 80,
      },
      // Optimize JPEG images
      jpeg: {
        quality: 80,
      },
      jpg: {
        quality: 80,
      },
      // Convert to WebP for modern browsers
      webp: {
        quality: 80,
      },
      // Cache optimized images
      cache: true,
      cacheLocation: 'node_modules/.cache/vite-plugin-image-optimizer',
    }),
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
