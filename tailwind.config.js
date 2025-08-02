/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        playfair: ['Playfair Display', 'serif'],
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'secondary-gradient': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'accent-gradient': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'warm-gradient': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        'generate-gradient': 'linear-gradient(90deg, #f6d365 0%, #ff7850 100%)',
      },
    },
  },
  plugins: [],
}
