import plugin from 'tailwindcss/plugin'

export const customPlugin = plugin(({ addComponents, addUtilities, addVariant }) => {
  addComponents({
    '.swoosh': {
      position: 'absolute',
      left: '-9999px',
    },
  })
  addUtilities({
    // Pointer Events
    '.pointer-events-box-none': {
      pointerEvents: 'none',
      '& > *:not(.pointer-events-none)': {
        pointerEvents: 'auto',
      },
    },
    '.pointer-events-box-only': {
      pointerEvents: 'auto',
      '& > *:not(.pointer-events-auto)': {
        pointerEvents: 'none',
      },
    },

    // Scrollbar
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
  addVariant('checked-within', '&:has(input:checked)')
})
