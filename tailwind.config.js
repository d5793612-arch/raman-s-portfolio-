/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          deep: '#23008E',
          accent: '#757BFD',
          coral: '#FF6464',
          mint: '#3ddc97',
          sun: '#ffb703',
        },
        space: {
          950: '#090a14',
          900: '#0e1122',
          850: '#141830',
          800: '#1a1f3c',
          700: '#272f56',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['Space Mono', 'JetBrains Mono', 'monospace'],
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(0.97)' },
        }
      }
    },
  },
  plugins: [],
}
