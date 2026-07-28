/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        baubau: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e', // Primary Civic Emerald
          800: '#115e59',
          900: '#134e4a',
          gold: '#d97706',
          goldLight: '#f59e0b',
        }
      }
    },
  },
  plugins: [],
}
