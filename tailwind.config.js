/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'smart-green': '#a3a551',
        'smart-dark': '#6b8a3a',
        'smart-light': '#e8efd6',
      }
    },
  },
  plugins: [],
}
