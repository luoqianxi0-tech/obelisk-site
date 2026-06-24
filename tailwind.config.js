/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        obelisk: {
          bg: '#f2f2f2',
          card: 'rgba(255,255,255,0.55)',
          line: '#111111',
          text: '#1a1a1a',
          muted: '#666666',
          accent: '#c9a227',
          accentHover: '#b8941f',
          glass: 'rgba(255,255,255,0.6)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
