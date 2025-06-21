import path from 'path'
import { fileURLToPath } from 'url'

/**
 * @typedef {import("@ianvs/prettier-plugin-sort-imports").PrettierConfig} PrettierConfig
 * @typedef {import("prettier-plugin-tailwindcss").PluginOptions} TailwindConfig
 */

/** @satisfies { PrettierConfig & TailwindConfig } */
const config = {
  plugins: ['@ianvs/prettier-plugin-sort-imports', 'prettier-plugin-tailwindcss'],

  // Base Config
  arrowParens: 'always',
  bracketSameLine: true,
  bracketSpacing: true,
  endOfLine: 'lf', // ensure linux-style line ending i.e \n
  jsxSingleQuote: true,
  printWidth: 100,
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  useTabs: false,
  experimentalOperatorPosition: 'start',
  experimentalTernaries: true,

  // Tailwind Config
  tailwindFunctions: ['cn', 'cva', 'tv'],

  // Import Config
  importOrder: [
    '^(react/(.*)$)|^(react$)|^(react-native(.*)$)',
    '^(next/(.*)$)|^(next$)',
    '^(expo(.*)$)|^(expo$)',
    '<THIRD_PARTY_MODULES>',
    '',
    '^@my/(.*)$',
    '',
    '^~/',
    '^[../]',
    '^[./]',
  ],
  importOrderBuiltinModulesToTop: true,
  importOrderCombineTypeAndValueImports: true,
  importOrderMergeDuplicateImports: true,
  importOrderSeparation: false,
  importOrderSortSpecifiers: true,
  importOrderTypeScriptVersion: '5.4.4',

  overrides: [
    {
      files: 'apps/basant.dev/**',
      options: {
        tailwindStylesheet: path.join(
          import.meta.dirname,
          '../../apps/basant.dev/src/app/globals.css',
        ),
      },
    },
    {
      files: 'apps/random/**',
      options: {
        tailwindConfig: fileURLToPath(
          new URL('../../apps/random/tailwind.config.ts', import.meta.url),
        ),
      },
    },
    {
      files: 'apps/spend-buddy/**',
      options: {
        tailwindConfig: fileURLToPath(
          new URL('../../apps/spend-buddy/tailwind.config.ts', import.meta.url),
        ),
      },
    },
  ],
}

export default config
