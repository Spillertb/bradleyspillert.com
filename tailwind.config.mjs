/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        accent: {
          DEFAULT: '#c8a87c',
          light: '#ddc4a0',
          dark: '#a88a5e',
        },
        surface: {
          DEFAULT: '#0a0a0a',
          raised: '#141414',
          overlay: '#1e1e1e',
        },
      },
    },
  },
  plugins: [],
};
