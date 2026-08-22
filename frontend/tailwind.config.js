/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Geist', '"Plus Jakarta Sans"', 'Inter', '-apple-system', 'sans-serif'],
        display: ['Geist', '"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        neo: {
          cyan: '#00F0FF',
          mint: '#00FFC2',
          dark: '#07090E',
          surface: '#0E1217',
          card: '#12161F',
          border: 'rgba(255, 255, 255, 0.08)',
        },
      },
      boxShadow: {
        'cyan-glow': '0 0 25px -5px rgba(0, 240, 255, 0.35)',
        'mint-glow': '0 0 25px -5px rgba(0, 255, 194, 0.35)',
        'cyber-card': '0 8px 32px 0 rgba(0, 0, 0, 0.55)',
      }
    },
  },
  plugins: [],
}
