/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Your worksheet color scheme
        primary: '#4A90E2',
        secondary: '#7BB3F0', 
        background: '#F8FAFE',
        'worksheet-text': '#2C3E50',
        borders: '#B8D4F0'
      },
      fontFamily: {
        'education': ['Comic Neue', 'Nunito', 'Arial', 'sans-serif']
      }
    },
  },
  plugins: [],
}
