/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#6366f1',
        'primary-dark': '#4f46e5',
        secondary: '#a78bfa',
        accent: '#f59e0b',
        surface: '#ffffff',
        'surface-2': '#f8fafc',
        text: '#1e293b',
        'text-2': '#64748b',
        border: '#e2e8f0',
      },
      fontFamily: {
        'orbitron': ['Orbitron', 'monospace'],
        'tech': ['Share Tech Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { filter: 'drop-shadow(0 0 10px rgba(0, 212, 255, 0.5))' },
          '100%': { filter: 'drop-shadow(0 0 20px rgba(0, 212, 255, 0.8))' },
        }
      }
    },
  },
  plugins: [],
}