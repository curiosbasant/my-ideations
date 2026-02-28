import { eq, sql } from 'drizzle-orm/sql'

import { db } from '../client'
import { profile } from '../schema'
import { authUserId, userPersonId, userProfileId } from '../utils/fn-helpers'

const fn = sql`
  create schema if not exists private;
  grant usage on schema private to anon, authenticated, service_role;

  create or replace function ${userPersonId}
  returns bigint as $$
    ${db.select({ id: profile.personId }).from(profile).where(eq(profile.createdBy, authUserId))};
  $$ language sql stable security definer
  set search_path = public;
  grant execute on function ${userPersonId} to anon, authenticated, service_role;

  create or replace function ${userProfileId}
  returns bigint as $$
    ${db.select({ id: profile.id }).from(profile).where(eq(profile.createdBy, authUserId))};
  $$ language sql stable security definer
  set search_path = public;
  grant execute on function ${userProfileId} to anon, authenticated, service_role;
`

export default () => db.execute(fn)
