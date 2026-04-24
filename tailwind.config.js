/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        burgundy: {
          DEFAULT: '#6d0504',
          light: '#98304b',
          dark: '#4a0012',
        },
        cream: {
          DEFAULT: '#F5F5DC',
          light: '#fffff0',
        },
        gold: {
          DEFAULT: '#D4AF37',
          light: '#f1c40f',
        },
        offwhite: '#FAFAFA',
      },
      fontFamily: {
        serif: ['"Bodoni Moda"', 'serif'],
        sans: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
