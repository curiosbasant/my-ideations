/** @type {import('prettier').Config} */
module.exports = {
  plugins: ['@ianvs/prettier-plugin-sort-imports', 'prettier-plugin-tailwindcss'],

  bracketSameLine: true,
  jsxSingleQuote: true,
  printWidth: 100,
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
  useTabs: false,

  importOrder: [
    '^(react/(.*)$)|^(react$)',
    '^(next/(.*)$)|^(next$)',
    '<THIRD_PARTY_MODULES>',
    '',
    '^~/server/(.*)$',
    '^~/app/(.*)$',
    '^~/components/(.*)$',
    '^~/(.*)$',
    '^~/utils/(.*)$',
    '^[./]',
  ],
  importOrderBuiltinModulesToTop: true,
  importOrderCombineTypeAndValueImports: true,
  importOrderMergeDuplicateImports: true,
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
  importOrderSeparation: false,
  importOrderSortSpecifiers: true,
}
