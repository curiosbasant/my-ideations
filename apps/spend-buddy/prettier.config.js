/**
 * @typedef {import("@ianvs/prettier-plugin-sort-imports").PrettierConfig} PrettierConfig
 * @typedef {import("prettier-plugin-tailwindcss").PluginOptions} TailwindConfig
 */

/** @satisfies { PrettierConfig & TailwindConfig } */
module.exports = {
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

  // Import Config
  importOrder: [
    '^(react/(.*)$)|^(react$)|^(react-native(.*)$)',
    '^(expo(.*)$)|^(expo$)',
    '<THIRD_PARTY_MODULES>',
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
  importOrderTypeScriptVersion: '~5.3.3',
}
