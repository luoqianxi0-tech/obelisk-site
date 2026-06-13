/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        obelisk: {
          bg: '#000000',
          fg: '#e0e0e5',
          accent: 'rgba(100,255,150,0.6)',
          accent2: 'rgba(80,180,255,0.6)',
          danger: 'rgba(255,80,80,0.6)',
          warn: 'rgba(255,200,80,0.7)',
          glass: 'rgba(255,255,255,0.03)',
          glassBorder: 'rgba(255,255,255,0.08)',
        }
      },
      fontFamily: {
        mono: ['"Courier New"', 'monospace'],
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-dot': 'pulseDot 2s infinite',
        'scan-line': 'scanLine 1.5s ease-out forwards',
      },
      keyframes: {
        pulseDot: { '0%,100%': { opacity: '0.4' }, '50%': { opacity: '1' } },
        scanLine: { '0%': { opacity: '0', transform: 'translateY(-100%)' }, '10%': { opacity: '1', transform: 'translateY(0)' }, '90%': { opacity: '1', transform: 'translateY(0)' }, '100%': { opacity: '0', transform: 'translateY(100%)' } }
      }
    }
  },
  plugins: []
}
