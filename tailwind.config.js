/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        tactical: {
          bg: '#1a1a1a',
          panel: '#242424',
          olive: '#4B5320',
          orange: '#D35400',
          gray: '#8C8C8C',
          text: '#EAEAEA',
          border: '#333333'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
