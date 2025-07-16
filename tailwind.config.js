/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        sendit: {
          primary: '#9aff00',
          secondary: '#6bb700',
          dark: '#1a1a1a',
          darker: '#0f0f0f',
          gray: {
            50: '#f9f9f9',
            100: '#f4f4f4',
            200: '#e4e4e4',
            300: '#d4d4d4',
            400: '#a3a3a3',
            500: '#737373',
            600: '#525252',
            700: '#404040',
            800: '#262626',
            900: '#171717',
          },
          success: '#22c55e',
          warning: '#f59e0b',
          error: '#ef4444',
        },
        discord: {
          blurple: '#5865F2',
          green: '#57F287',
          yellow: '#FEE75C',
          fuchsia: '#EB459E',
          red: '#ED4245',
          white: '#FFFFFF',
          black: '#000000',
          dark: '#2C2F33',
          darker: '#23272A',
        },
        solana: {
          purple: '#9945FF',
          green: '#14F195',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
      backgroundImage: {
        'gradient-sendit': 'linear-gradient(135deg, #9aff00 0%, #6bb700 100%)',
        'gradient-sendit-dark': 'linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%)',
        'gradient-discord': 'linear-gradient(135deg, #5865F2 0%, #3B4CF7 100%)',
        'gradient-solana': 'linear-gradient(135deg, #9945FF 0%, #14F195 100%)',
      }
    },
  },
  plugins: [],
}