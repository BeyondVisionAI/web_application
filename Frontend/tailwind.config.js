module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        transparent: 'transparent',
        'myBlue': '#7793ED',
        'myBlack': '#444655',
        'myWhite': '#F6F8FF',
        'disable': 'C4C4C4'
      }
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
