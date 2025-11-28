/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"PF Futura Neu"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
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
        secondary: {
          DEFAULT: '#2563EB',
          50: '#E5EEFF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E3A8A',
          900: '#1E3A5F',
        },
      },
    },
  },
  plugins: [],
};
