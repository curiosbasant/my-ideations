import { QueryBuilder } from 'drizzle-orm/pg-core'

export const qb = new QueryBuilder({ casing: 'snake_case' })
