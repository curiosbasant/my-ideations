import { sql, type SQLWrapper } from 'drizzle-orm'

export const coalesce = (...expressions: SQLWrapper[]) => sql`coalesce(${expressions})`
