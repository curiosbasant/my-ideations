// @ts-check
const plugin = require('tailwindcss/plugin')

// @ts-ignore
module.exports = plugin(function ({ addComponents, addVariant, theme }) {
  addComponents({
    ':is([data-balloon-top], [data-balloon-left], [data-balloon-bottom], [data-balloon-right])': {
      position: 'relative',
      '&::before, &::after': {
        content: 'var(--tw-content)',
        position: 'absolute',
        top: '50%',
        left: '50%',
        '--tw-translate-x': '-50%',
        '--tw-translate-y': '-50%',
        opacity: '0',
        transition: 'all 150ms ease-out 250ms',
        zIndex: '999',
        boxShadow: theme('boxShadow.md'),
        pointerEvents: 'none',
        transform:
          'translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate, 0))',
      },
      '&:hover::before, &:hover::after': {
        opacity: '1',
        backgroundColor: theme('colors.emerald.500'),
      },
      '&::before': {
        '--tw-rotate': '45deg',
        borderRadius: theme('borderRadius.sm'),
        padding: theme('spacing[1.5]'),
      },
      '&::after': {
        '--tw-content':
          'attr(data-balloon-top) attr(data-balloon-left) attr(data-balloon-bottom) attr(data-balloon-right)',
        padding: "theme('spacing.1') theme('spacing.2')",
        whiteSpace: 'nowrap',
        borderRadius: theme('borderRadius.DEFAULT'),
        color: theme('colors.white'),
      },
    },
    /* TOP */
    '[data-balloon-top]:hover::before': {
      top: "calc(theme('spacing.3') * -1)",
    },
    '[data-balloon-top]:hover::after': {
      '--tw-translate-y': '-100%',
      top: "calc(theme('spacing.3') * -1)",
    },
    /* BOTTOM */
    '[data-balloon-bottom]:hover::before': {
      top: "calc(100% + theme('spacing.3'))",
    },
    '[data-balloon-bottom]:hover::after': {
      '--tw-translate-y': '0',
      top: "calc(100% + theme('spacing.3'))",
    },
    /* LEFT */
    '[data-balloon-left]:hover::before': {
      left: "calc(theme('spacing.3') * -1)",
    },
    '[data-balloon-left]:hover::after': {
      '--tw-translate-x': '-100%',
      left: "calc(theme('spacing.3') * -1)",
    },
    /* RIGHT */
    '[data-balloon-right]:hover::before': {
      left: "calc(100% + theme('spacing.3'))",
    },
    '[data-balloon-right]:hover::after': {
      '--tw-translate-x': '0',
      left: "calc(100% + theme('spacing.3'))",
    },
  })
  addVariant('optional', '&:optional')
  addVariant('balloon', '&:optional')
  addVariant('hocus', ['&:hover', '&:focus'])
})
