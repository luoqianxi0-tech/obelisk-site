/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obelisk: {
          bg: '#f5f5f5',
          card: 'rgba(255,255,255,0.75)',
          text: '#1a1a1a',
          muted: '#666666',
          line: 'rgba(0,0,0,0.08)',
          accent: '#000000',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
