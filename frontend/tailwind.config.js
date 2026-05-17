/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/**/*.html", "./src/js/**/*.js"],
  theme: {
    extend: {
      colors: {
        'earth-dark': '#2c3e2e',
        'earth-light': '#f4f1ea',
        'earth-accent': '#c48f56',
        'earth-card': '#ffffff'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}