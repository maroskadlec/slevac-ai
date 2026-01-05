/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'heading': ['"DM Sans"', 'sans-serif'],
      },
      animation: {
        'float-up': 'float-up 0.3s ease-out',
      },
      keyframes: {
        'float-up': {
          '0%': { transform: 'translateY(0px)' },
          '100%': { transform: 'translateY(-4px)' },
        }
      }
    },
  },
  plugins: [],
}

