import containerQueriesPlugin from '@tailwindcss/container-queries'
import formsPlugin from '@tailwindcss/forms'
import plugin from 'tailwindcss/plugin'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/(app|components|pages)/**/*.tsx', './src/*/components/**/*.tsx'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        icon: [
          'var(--material-icons)',
          { fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 48" },
        ],
        'icon-outline': [
          'var(--material-icons)',
          { fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 48" },
        ],
      },
    },
  },
  plugins: [
    containerQueriesPlugin,
    formsPlugin,
    plugin(({ addUtilities }) => {
      addUtilities({
        '.text-wrap': { 'text-wrap': 'wrap' },
        '.text-nowrap': { 'text-wrap': 'nowrap' },
        '.text-balance': { 'text-wrap': 'balance' },
      })
    }),
  ],
}
