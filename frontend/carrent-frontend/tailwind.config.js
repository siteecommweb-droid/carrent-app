/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'cyber': {
          50: '#e6fffe',
          100: '#b3fffd',
          200: '#80fffc',
          300: '#4dfffb',
          400: '#1afffa',
          500: '#00e6e0',
          600: '#00b8b3',
          700: '#008a86',
          800: '#005c59',
          900: '#002e2d',
        },
        'neon': {
          pink: '#ff2d75',
          blue: '#00d4ff',
          purple: '#b026ff',
          green: '#39ff14',
          yellow: '#ffea00',
          orange: '#ff6600',
        },
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'slide-up': 'slide-up 0.5s ease-out',
        'gradient-shift': 'gradient-shift 3s ease infinite',
        'border-run': 'border-run 2s linear infinite',
      },
      keyframes: {
        glow: {
          '0%': { textShadow: '0 0 5px rgba(0, 212, 255, 0.5)', boxShadow: '0 0 5px rgba(0, 212, 255, 0.3)' },
          '100%': { textShadow: '0 0 20px rgba(0, 212, 255, 0.8)', boxShadow: '0 0 30px rgba(0, 212, 255, 0.5)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(100px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'border-run': {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        },
      },
      boxShadow: {
        'neon': '0 0 10px rgba(0, 212, 255, 0.6), 0 0 20px rgba(0, 212, 255, 0.4)',
        'neon-lg': '0 0 20px rgba(0, 212, 255, 0.7), 0 0 40px rgba(0, 212, 255, 0.5)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      },
      fontFamily: {
        'cyber': ['"Orbitron"', 'monospace'],
        'futuristic': ['"Space Grotesk"', 'sans-serif'],
        'tech': ['"Rajdhani"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}