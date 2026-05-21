/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#05070c',
          card: '#0c1222',
          cardBorder: '#1e293b',
          glowBlue: '#3b82f6',
          glowTeal: '#14b8a6',
          glowPurple: '#a855f7',
          glowRed: '#ef4444',
          glowAmber: '#f59e0b',
        }
      },
      boxShadow: {
        'glow-blue': '0 0 15px rgba(59, 130, 246, 0.15)',
        'glow-teal': '0 0 15px rgba(20, 184, 166, 0.15)',
        'glow-green': '0 0 15px rgba(16, 185, 129, 0.15)',
        'glow-red': '0 0 15px rgba(239, 68, 68, 0.15)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Outfit', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
