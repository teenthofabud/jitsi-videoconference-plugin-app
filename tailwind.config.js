/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5959d5',
        blue: {
          50: '#f0f4ff',
          100: '#e6edff',
          200: '#ccdaff',
          300: '#99b3ff',
          400: '#668cff',
          500: '#5959d5',
          600: '#3d3ba8',
          700: '#2e2d7f',
          800: '#1f1e56',
          900: '#14132d',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
