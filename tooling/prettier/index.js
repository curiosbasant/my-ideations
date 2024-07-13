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
  endOfLine: 'lf',
  jsxSingleQuote: true,
  printWidth: 100,
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  useTabs: false,

  // Tailwind Config
  tailwindConfig: fileURLToPath(new URL('../../tooling/tailwind/web.js', import.meta.url)),
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
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
  importOrderSeparation: false,
  importOrderSortSpecifiers: true,
  importOrderTypeScriptVersion: '5.4.4',
}

export default config
