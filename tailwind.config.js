/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./projects/*/src/**/*.{html,ts}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Mapped to CSS variables defined in styles.scss so Tailwind color
        // utilities stay in sync with the theme tokens / accent swap.
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        'surface-2': 'var(--surface-2)',
        card: 'var(--card)',
        text: 'var(--text)',
        'text-2': 'var(--text-2)',
        'text-3': 'var(--text-3)',
        border: 'var(--border)',
        accent: 'var(--accent)',
        'accent-text': 'var(--accent-text)',
        'on-accent': 'var(--on-accent)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      maxWidth: {
        content: '1180px',
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        float: 'float 6s ease-in-out infinite',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
