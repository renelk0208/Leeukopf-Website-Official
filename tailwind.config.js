/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"PF Futura Neu"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Brand fuchsia - primary brand colour #A3005A
        brandFuchsia: '#A3005A',
        primary: {
          DEFAULT: '#A3005A',
          50: '#F9E6F0',
          100: '#F5CCE2',
          200: '#EB99C5',
          300: '#E166A7',
          400: '#D7338A',
          500: '#A3005A',
          600: '#820048',
          700: '#610036',
          800: '#410024',
          900: '#200012',
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
        // Fuchsia tint for subtle backgrounds/hovers
        fuchsiaTint: '#F5D4E4',
      },
    },
  },
  plugins: [],
};
