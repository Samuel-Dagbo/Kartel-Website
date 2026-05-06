module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,.jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        black: '#000',
        white: '#fff',
        gray: '#e5e7eb',
        gold: '#fbbf24',
        'gold-dark': '#b8860b',
        'primary': '#111827',
        'accent': '#fbbf24',
        'border': '#d1d5db',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui'],
        serif: ['Playfair Display', 'serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            fontFamily: 'var(--font-sans)',
            lineHeight: '1.5',
            letterSpacing: 'normal',
          },
        },
      },
    },
  },
  plugins: [
    require('tailwindcss/plugin')({
      tailwindConfig: (config) => {
        config.theme.extend.fontFamily = {
          display: ['"Playfair Display"', 'serif'],
          sans: ['Inter', 'system-ui'],
        };
        return config;
      },
    }),
  ],
};