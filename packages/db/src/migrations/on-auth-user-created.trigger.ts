import { sql } from 'drizzle-orm'
import * as sb from 'drizzle-orm/supabase'

import { db } from '../client'
import * as schema from '../schema'

const fnName = sql.raw('public.create_user_profile')

const insertProfileSql = sql.raw(
  db
    .insert(schema.profile)
    .values({
      username: sql`new.raw_user_meta_data ->> 'username'`,
      firstName: sql`split_part(new.raw_user_meta_data ->> 'full_name', ' ', 1)`,
      lastName: sql`split_part(new.raw_user_meta_data ->> 'full_name', ' ', 2)`,
      email: sql`new.email`,
      avatarUrl: sql`new.raw_user_meta_data ->> 'avatar_url'`,
      createdBy: sql`new.id`,
    })
    .toSQL().sql,
)

/**
 * Create a profile for every user registered
 */
const fn = sql`
  create or replace function ${fnName}()
  returns trigger as $$
    begin
      ${insertProfileSql};
      return new;
    end;
  $$ language plpgsql security definer set search_path = public;

  alter function ${fnName}() owner to postgres;
  grant all on function ${fnName}() to anon, authenticated, service_role;

  create or replace trigger on_auth_user_created
  after insert on ${sb.authUsers} for each row
  execute function ${fnName}();
`

export default () => db.execute(fn)
