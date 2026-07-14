/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          50: '#f2f9f7',
          100: '#dcf0ea',
          600: '#0f8a72',
          700: '#0f766e',
          800: '#115e59',
          900: '#0c433f',
        },
        amber: {
          500: '#f59e0b',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
};
