/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ivory: {
          50: '#fffdf8',
          100: '#fff8ec',
          200: '#f8ead4',
        },
        blush: {
          50: '#fff4f5',
          100: '#ffe6ea',
          300: '#f5a9b5',
          500: '#d85b74',
          700: '#96384c',
        },
        gold: {
          100: '#fff1c2',
          300: '#e9c877',
          500: '#c59b3b',
          700: '#8d681f',
        },
        emerald: {
          500: '#1f8a70',
          700: '#145f4f',
        },
        charcoal: {
          800: '#2a2420',
          900: '#151210',
        },
      },
      boxShadow: {
        luxury: '0 24px 70px rgba(113, 77, 39, 0.16)',
        soft: '0 14px 35px rgba(34, 26, 20, 0.08)',
      },
      opacity: {
        45: '0.45',
        48: '0.48',
        55: '0.55',
        65: '0.65',
        68: '0.68',
        78: '0.78',
        82: '0.82',
        88: '0.88',
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
