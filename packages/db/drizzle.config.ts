import type { Config } from 'drizzle-kit'

// Needed for `drizzle-kit push`
if (!process.env['POSTGRES_URL_NON_POOLING']) throw new Error('Required PostgreSQL connection url.')

export default {
  casing: 'snake_case',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env['POSTGRES_URL_NON_POOLING'],
  },
  schema: './src/schema/index.ts',
  schemaFilter: 'public',
  strict: true,
  verbose: true,
} satisfies Config
