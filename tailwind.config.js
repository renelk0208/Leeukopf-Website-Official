/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"PF Futura Neu"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Brand blue - primary brand colour #1F2566 (name kept for backward-compat)
        brandFuchsia: '#1F2566',
        primary: {
          DEFAULT: '#1F2566',
          50: '#EBEDF7',
          100: '#C4C8E8',
          200: '#8891D0',
          300: '#5560B5',
          400: '#3A44A0',
          500: '#1F2566',
          600: '#161B4C',
          700: '#10143A',
          800: '#0B0E29',
          900: '#060818',
        },
        // Bright blue for CTAs
        brightPink: {
          DEFAULT: '#2A33A3',
          hover: '#1F2566',
        },
        // Grey palette for UI elements
        grey: {
          footer: '#E8E8E8',
          card: '#D4D4D4',
          primary: '#444444',
          secondary: '#6B6B6B',
          offWhite: '#FAFAFA',
          charcoal: '#262626',
        },
        // Blue tint for subtle backgrounds/hovers (name kept for backward-compat)
        fuchsiaTint: '#E7E9F5',
      },
    },
  },
  plugins: [],
};
