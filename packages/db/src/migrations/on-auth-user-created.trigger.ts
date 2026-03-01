import { authUsers } from 'drizzle-orm/supabase'

import { db } from '../client'
import * as schema from '../schema'
import { aliasExcluded } from '../utils/helpers/helpers'
import { coalesce, now, splitPart, sql } from '../utils/helpers/sql'

export const queryProfileInsert = db
  .insert(schema.profile)
  .values({
    username: sql`new.raw_user_meta_data ->> 'username'`,
    firstName: splitPart(sql`new.raw_user_meta_data ->> 'full_name'`, ' ', 1),
    lastName: splitPart(sql`new.raw_user_meta_data ->> 'full_name'`, ' ', 2),
    email: sql`new.email`,
    avatarUrl: sql`new.raw_user_meta_data ->> 'avatar_url'`,
    createdBy: sql`new.id`,
  })
  .onConflictDoUpdate({
    target: schema.profile.email,
    set: aliasExcluded(schema.profile, (excluded) => ({
      username: coalesce(schema.profile.username, excluded.username),
      firstName: coalesce(schema.profile.firstName, excluded.firstName),
      lastName: coalesce(schema.profile.lastName, excluded.lastName),
      avatarUrl: coalesce(schema.profile.avatarUrl, excluded.avatarUrl),
      createdBy: excluded.createdBy,
      updatedAt: now(),
    })),
  })

const createUserProfile = sql.raw(`private.create_user_profile`)

/**
 * Create a profile for every user registered
 */
const fn = sql`
  create schema if not exists private;

  create or replace function ${createUserProfile}()
  returns trigger as $$
    begin
      ${sql.raw(queryProfileInsert.toSQL().sql)};
      return new;
    end;
  $$ language plpgsql security definer
  set search_path = public;

  create or replace trigger on_auth_user_created
  after insert on ${authUsers} for each row
  execute function ${createUserProfile}();
`

export default () => db.execute(fn)
