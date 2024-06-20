import postgres from 'postgres'

if (!process.env['POSTGRES_URL']) throw new Error('Required PostgreSQL connection url.')

declare global {
  var pgClient: undefined | postgres.Sql
}

// Disable prefetch as it is not supported for "Transaction" pool mode
export const client =
  globalThis.pgClient ?? postgres(process.env['POSTGRES_URL']!, { prepare: false })
if (process.env['NODE_ENV'] !== 'production') globalThis.pgClient = client
