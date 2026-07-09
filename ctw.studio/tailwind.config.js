/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './*.js', './portfolio/**/*.html', './portfolio/**/*.js', './workshop/**/*.html', './workshop/**/*.js'],
  theme: {
    extend: {
      colors: {
        coal: '#050505',
        chalk: '#f6f5f0',
        ember: '#f7b500',
        dusk: '#0d0d0d'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    }
  }
}
