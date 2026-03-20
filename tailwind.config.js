/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'zelda-green': '#10ad42',
        'zelda-darkgreen': '#008000',
        'zelda-blue': '#1984ff',
        'zelda-purple': '#b59cbd',
        'zelda-orange': '#ffbd8c',
        'zelda-yellow': '#ffff8c',
        'zelda-gold': '#ffb531',
        'zelda-dark': '#3a1952',
      },
      fontFamily: {
        sans: ['Nunito', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
