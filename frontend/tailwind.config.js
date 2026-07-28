/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        baubauBlue: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1', // Official Baubau Shield Royal Blue
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        baubauYellow: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15', // Official Baubau Shield Bright Yellow
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
        },
        baubauGreen: {
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d', // Official Baubau Padi Green
        }
      }
    },
  },
  plugins: [],
}
