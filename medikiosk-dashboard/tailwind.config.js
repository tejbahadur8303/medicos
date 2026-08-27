/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0E7C86',
          dark: '#075A63',
          light: '#E4F1F1',
        },
        accent: {
          DEFAULT: '#1565C0',
          light: '#E7EFFB',
        },
        surface: '#FFFFFF',
        canvas: '#F5F8F8',
        ink: {
          DEFAULT: '#14232B',
          soft: '#51666D',
          faint: '#8FA0A5',
        },
        border: '#DCE7E7',
        danger: {
          DEFAULT: '#C62828',
          light: '#FBEAEA',
        },
        warning: {
          DEFAULT: '#B45309',
          light: '#FBF1E1',
        },
        success: {
          DEFAULT: '#2E7D32',
          light: '#E8F3E8',
        },
      },
      fontFamily: {
        display: ['"Lexend"', 'sans-serif'],
        sans: ['"Inter"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(20, 35, 43, 0.04), 0 1px 8px rgba(20, 35, 43, 0.04)',
        popover: '0 8px 30px rgba(20, 35, 43, 0.12)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
}

