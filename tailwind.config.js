/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark': '#1a1a1a',
        'darker': '#0a0a0a',
        'accent': '#3b82f6',
      },
      backdropBlur: {
        'lg': '16px',
      },
    },
  },
  plugins: [],
} 