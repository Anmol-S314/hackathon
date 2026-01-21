/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        purple: {
          dark: '#1a0033',
          primary: '#8B5CF6',
          light: '#A78BFA',
        },
        pink: {
          primary: '#EC4899',
          light: '#F472B6',
        },
        neon: {
          green: '#84CC16',
          yellow: '#FACC15',
        }
      },
      fontFamily: {
        heading: ['Inter', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
        display: ['Luckiest Guy', 'cursive'],
        comic: ['Bangers', 'cursive'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
        'gradient-neon': 'linear-gradient(135deg, #84CC16 0%, #FACC15 100%)',
        'gradient-bg': 'linear-gradient(180deg, #1a0033 0%, #0f001a 100%)',
      }
    },
  },
  plugins: [],
}
