/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
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
          600: '#0284c7', // Baubau Shield Outer Blue
          700: '#0369a1', // Baubau Royal Blue
          800: '#075985',
          900: '#0c4a6e', // Baubau Navy Blue
          950: '#082f49',
        },
        baubauYellow: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15', // Baubau Inner Shield Bright Yellow
          500: '#eab308', // Baubau Gold
          600: '#ca8a04',
          700: '#a16207',
        },
        baubauGreen: {
          500: '#22c55e',
          600: '#16a34a', // Baubau Padi/Kapas Green
          700: '#15803d',
        },
        "background": "#f8fafc",
        "surface-variant": "#e2e8f0",
        "primary": "#0369a1", // Baubau Royal Blue
        "primary-container": "#0284c7",
        "primary-fixed": "#e0f2fe",
        "secondary": "#ca8a04", // Baubau Gold
        "secondary-container": "#fef08a",
        "on-primary": "#ffffff",
        "on-secondary": "#000000",
        "outline": "#64748b",
        "outline-variant": "#cbd5e1",
        "surface": "#f8fafc",
        "error": "#ef4444",
      },
      spacing: {
        "container-max": "1280px",
        "margin-desktop": "32px",
        "gutter": "24px"
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        headline: ["Plus Jakarta Sans", "sans-serif"],
        body: ["Inter", "sans-serif"],
      }
    },
  },
  plugins: [],
}
