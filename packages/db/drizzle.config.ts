import type { Config } from 'drizzle-kit'

// Needed for `drizzle-kit push`
if (!process.env['POSTGRES_URL']) throw new Error('Required PostgreSQL connection url.')

export default {
  dialect: 'postgresql',
  schema: './src/schema/index.ts',
  out: '../../supabase/migrations',
  dbCredentials: {
    url: process.env['POSTGRES_URL'],
  },
  casing: 'snake_case',
  entities: {
    roles: {
      provider: 'supabase',
    },
  },
} satisfies Config
