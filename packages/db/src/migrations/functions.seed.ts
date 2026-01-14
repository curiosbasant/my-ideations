import { eq, sql } from 'drizzle-orm'

import { db } from '../client'
import { profile } from '../schema'

const fn = sql`
  create or replace function get_auth_user_profile_id()
  returns bigint as $$
    ${db
      .select({ id: profile.id })
      .from(profile)
      .where(eq(profile.createdBy, sql`auth.uid()`))};
  $$ language sql stable security definer set search_path = public;
`

export default () => db.execute(fn)
