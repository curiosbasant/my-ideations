/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/(app|pages)/**/*.tsx', './src/*/components/**/*.tsx'],
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        loading: 'loading 500ms ease-in-out alternate infinite',
      },
      backdropBlur: {
        xs: '2px',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
        inherit: 'inherit',
      },
      borderWidth: { 0.5: '0.5px' },
      colors: {
        aqua: '#05a989',
      },
      fontFamily: {
        icon: 'var(--material-icons)',
        'icon-outline': 'var(--material-icons)',
      },
      fontSize: {
        xxs: ['0.625rem', '0.75rem'],
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
      lineHeight: {
        12: '3rem',
      },
      ringOffsetWidth: ({ theme }) => theme('ringWidth'),
      ringWidth: {
        3: '3px',
      },
      scale: {
        80: '0.8',
      },
      screens: {
        xs: '475px',
      },
      skew: {
        8: '8deg',
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
  ],
}
