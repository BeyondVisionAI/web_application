module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
    colore: {
      myBlue: '#7793ED',
      myBlack: '#444655',
      myWhite: '#F6F8FF',
      disable: 'C4C4C4'
    },
    boxShadow: {
      'xs': '0px 40px 40px rgba(0, 0, 0, 0.25)',
    },
    dropShadow: {
      'xs': '0 4px 4px rgba(0, 0, 0, 0.25)',
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
