/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/(app|pages)/**/*.tsx', './src/*/components/**/*.tsx'],
  darkMode: 'class',
  theme: {
    extend: {
      backdropBlur: {
        xs: '2px',
      },
      fontFamily: {
        icon: 'var(--material-icons)',
      },
      fontSize: {
        xxs: ['0.625rem', '0.75rem'],
      },
      ringWidth: {
        3: '3px',
      },
      lineHeight: {
        12: '3rem',
      },
      ringOffsetWidth: ({ theme }) => theme('ringWidth'),
      colors: {
        aqua: '#05a989',
      },
      borderWidth: { 0.5: '0.5px' },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      scale: {
        80: '0.8',
      },
      keyframes: {
        loading: {
          '0%': {
            opacity: '0.33',
          },
          '100%': {
            opacity: '1',
            scale: '1.25',
          },
        },
      },
      animation: {
        loading: 'loading 500ms ease-in-out alternate infinite',
      },
      screens: {
        xs: '475px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/container-queries'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/line-clamp'),
    require('tailwindcss/plugin')(({ addComponents, addUtilities, addVariant }) => {
      addComponents({
        '.pointer-events-box-none': {
          pointerEvents: 'none',
          '& *': {
            pointerEvents: 'auto',
          },
        },
        '.pointer-events-box-only': {
          pointerEvents: 'auto',
          '& *': {
            pointerEvents: 'none',
          },
        },
      })

      addUtilities({
        '.scrollbar-auto': { 'scrollbar-width': 'auto' },
        '.scrollbar-thin': { 'scrollbar-width': 'thin' },
        '.scrollbar-none': {
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
      })

      addVariant('befter', ['&::before', '&::after'])
    }),
    //
  ],
}
