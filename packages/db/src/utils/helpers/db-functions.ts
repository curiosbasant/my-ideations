import { sql } from 'drizzle-orm/sql'

export const authUserId = sql<string>`auth.uid()`
export const selectUserId = sql<string>`(select ${authUserId})`
export const selectAuthRole = sql<string>`(select auth.role())`
export const userPersonId = sql<number>`private.get_user_person_id()`
export const selectPersonId = sql<number>`(select ${userPersonId} as ${sql.identifier('personId')})`
export const userProfileId = sql<number>`private.get_user_profile_id()`
export const selectProfileId = sql<number>`(select ${userProfileId})`
