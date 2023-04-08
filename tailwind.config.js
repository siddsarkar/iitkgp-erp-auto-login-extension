/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/pages/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        primary: '#5c6ac4',
        secondary: '#ecc94b'
      }
    }
  },
  darkMode: 'class',
  plugins: [require('@tailwindcss/forms')]
}
