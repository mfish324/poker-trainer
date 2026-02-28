/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'poker-green': '#0d5c2e',
        'poker-felt': '#1a7842',
        'card-red': '#dc2626',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.3)',
        'card-glow': '0 0 15px rgba(251, 191, 36, 0.6)',
      }
    },
  },
  plugins: [],
}
