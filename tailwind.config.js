/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'glass-primary': '#667eea',
        'glass-secondary': '#764ba2',
        'glass-accent': '#f093fb',
        'glass-cyan': '#4facfe',
        'glass-blue': '#00f2fe',
        'glass-warm': '#fa709a',
        'glass-peach': '#ff9a9e',
        'glass-mint': '#a8edea',
        'glass-lavender': '#d299c2',
        'glass-coral': '#ff6b6b',
        'glass-gold': '#feca57',
        'glass-sky': '#74b9ff',
        'glass-text': '#1a1a2e',
        'glass-text-secondary': '#4a4a6a',
      },
      fontFamily: {
        sans: ['Nunito', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        'glass-heavy': '0 16px 48px 0 rgba(31, 38, 135, 0.2)',
        'glass-inset': 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.4)',
        'glass-glow': '0 0 20px rgba(102, 126, 234, 0.3)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      animation: {
        'glass-shimmer': 'glass-shimmer 3s ease-in-out infinite',
        'glass-pulse': 'glass-pulse 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        'glass-shimmer': {
          '0%, 100%': { opacity: '0.7' },
          '50%': { opacity: '1' },
        },
        'glass-pulse': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.02)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
