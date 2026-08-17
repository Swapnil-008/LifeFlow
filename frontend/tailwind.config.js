/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: 'rgb(var(--color-paper) / <alpha-value>)',
          card: 'rgb(var(--color-paper-card) / <alpha-value>)',
          border: 'rgb(var(--color-paper-border) / <alpha-value>)',
        },
        ink: {
          DEFAULT: 'rgb(var(--color-ink) / <alpha-value>)',
          soft: 'rgb(var(--color-ink-soft) / <alpha-value>)',
          muted: 'rgb(var(--color-ink-muted) / <alpha-value>)',
        },
        brand: {
          50: '#EAF4F1',
          100: '#CFE6DE',
          300: '#7FBCA9',
          500: '#1F6F5C',
          600: '#195A4B',
          700: '#134539',
        },
        amber: {
          50: '#FBF3E4',
          300: '#E3B268',
          500: '#C98A2C',
          600: '#A66F1F',
        },
        coral: {
          50: '#FBEBE8',
          300: '#DE9186',
          500: '#C1493E',
          600: '#9E3A30',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.25rem',
      },
      boxShadow: {
        card: '0 1px 2px rgba(28,27,31,0.04), 0 1px 8px rgba(28,27,31,0.04)',
        'card-hover': '0 2px 4px rgba(28,27,31,0.06), 0 8px 24px rgba(28,27,31,0.08)',
      },
    },
  },
  plugins: [],
};
