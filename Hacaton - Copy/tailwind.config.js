/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        eco: {
          bg: '#0F3A2D',
          dark: '#09291F',
          card: '#0F3A2D',
          cardDark: '#09291F',
          gold: '#D4AF37',
          goldLight: '#E6C65C',
          goldGlow: 'rgba(212, 175, 55, 0.35)',
          muted: '#E8E8E8',
          subtle: 'rgba(232, 232, 232, 0.7)',
          borderGold: 'rgba(212, 175, 55, 0.4)',
        }
      },
      fontFamily: {
        sans: ['"Times New Roman"', 'Times', 'serif'],
        serif: ['"Times New Roman"', 'Times', 'serif'],
      },
      boxShadow: {
        gold: '0 4px 20px -2px rgba(212, 175, 55, 0.25)',
        goldLg: '0 8px 30px rgba(212, 175, 55, 0.35)',
        card: '0 10px 30px -5px rgba(0, 0, 0, 0.5)',
      }
    },
  },
  plugins: [],
}
