/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'velik-black': '#1E1E1E',
        'velik-gold': '#C9A96E',
      }
    },
  },
  plugins: [],
}
