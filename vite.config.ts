import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'html-transform',
      transformIndexHtml(html) {
        // Replace __VITE_META_PIXEL_ID__ with actual value or empty string
        const pixelId = process.env.VITE_META_PIXEL_ID || '';
        return html.replace(/__VITE_META_PIXEL_ID__/g, pixelId);
      },
    },
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
