import containerQueriesPlugin from '@tailwindcss/container-queries'
import formsPlugin from '@tailwindcss/forms'
import typographyPlugin from '@tailwindcss/typography'
import animatePlugin from 'tailwindcss-animate'

import base from './base'
import { customPlugin } from './plugins/custom'

/** @satisfies {import('tailwindcss').Config} */
export default {
  content: base.content,
  presets: [base],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'caret-blink': 'caret-blink 1.25s ease-out infinite',
        'collapsible-down': 'collapsible-down 0.2s ease-out',
        'collapsible-up': 'collapsible-up 0.2s ease-out',
        spinner: 'spinner 1s infinite linear',
      },
      aspectRatio: {
        full: '4 / 3',
        wide: '16 / 9',
      },
      borderRadius: {
        inherit: 'inherit',
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      flex: {
        2: '2 2 0%',
      },
      fontFamily: {
        icon: [
          'Material Symbols Rounded',
          { fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 48" },
        ],
        'icon-outline': [
          'Material Symbols Rounded',
          { fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 48" },
        ],
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'caret-blink': {
          '0%,70%,100%': { opacity: '1' },
          '20%,50%': { opacity: '0' },
        },
        'collapsible-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-collapsible-content-height)' },
        },
        'collapsible-up': {
          from: { height: 'var(--radix-collapsible-content-height)' },
          to: { height: '0' },
        },
        spinner: {
          to: {
            transform: 'rotate(1turn)',
          },
        },
      },
      screens: {
        xs: '475px',
      },
      typography: (/** @type {(path: string)=> any} */ theme) => ({
        DEFAULT: {
          css: {
            a: {
              cursor: 'pointer',
              textUnderlineOffset: '3px',
            },
            'ul[data-type=taskList]': {
              padding: '0',

              '& > li': {
                display: 'flex',
                gap: theme('spacing.3'),
                alignItems: 'flex-start',
                margin: `${theme('spacing.3')} 0`,
                listStyle: 'none',

                '& input': {
                  borderRadius: theme('borderRadius.sm'),
                },
                '& p': {
                  margin: '0',
                },
              },
            },
          },
        },
      }),
    },
  },
  plugins: [animatePlugin, containerQueriesPlugin, formsPlugin, typographyPlugin, customPlugin],
}
