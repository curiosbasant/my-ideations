import type { Config } from 'drizzle-kit'

// Needed for `drizzle-kit push`
if (!process.env['POSTGRES_URL']) throw new Error('Required PostgreSQL connection url.')

export default {
  dialect: 'postgresql',
  schema: './src/schema/index.ts',
  dbCredentials: {
    url: process.env['POSTGRES_URL'],
  },
  schemaFilter: 'public',
  casing: 'snake_case',
} satisfies Config
