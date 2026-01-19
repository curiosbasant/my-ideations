import { eq, sql } from 'drizzle-orm'

import { db } from '../client'
import { profile } from '../schema'

const fn = sql`
  create or replace function get_auth_user_person_id()
  returns bigint as $$
    ${db
      .select({ id: profile.personId })
      .from(profile)
      .where(eq(profile.createdBy, sql`auth.uid()`))};
  $$ language sql stable security definer set search_path = public;
  alter function get_auth_user_person_id() owner to postgres;

  create or replace function get_auth_user_profile_id()
  returns bigint as $$
    ${db
      .select({ id: profile.id })
      .from(profile)
      .where(eq(profile.createdBy, sql`auth.uid()`))};
  $$ language sql stable security definer set search_path = public;
  alter function get_auth_user_profile_id() owner to postgres;
`

export default () => db.execute(fn)
