const colors = require('tailwindcss/colors')

module.exports = {
  content: ['./src/pages/**/*.{html,ts}'],
  theme: {
    colors: {
      primary: '#5c6ac4',
      secondary: '#ecc94b',

      // exclude renamed colors on tailwindcss/colors v3
      ...Object.keys(colors).reduce((acc, key) => {
        if (['lightBlue', 'warmGray', 'trueGray', 'coolGray', 'blueGray'].includes(key)) {
        } else {
          acc[key] = colors[key]
        }
        return acc
      }, {})
    },
    extend: {}
  },
  darkMode: 'class',
  plugins: [require('@tailwindcss/forms')]
}
