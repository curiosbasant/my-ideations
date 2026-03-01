import { db } from '../client'
import * as schema from '../schema'
import { aliasExcluded, aliasNew } from '../utils/helpers/helpers'
import { coalesce, extractJson, now, splitPart, sql } from '../utils/helpers/sql'
import { authUser } from '../utils/helpers/supabase'

export const queryProfileInsert = db
  .insert(schema.profile)
  .values(
    aliasNew(authUser, (new_) => ({
      username: extractJson(new_.rawUserMetaData, 'username'),
      firstName: splitPart(extractJson(new_.rawUserMetaData, 'full_name'), ' ', 1),
      lastName: splitPart(extractJson(new_.rawUserMetaData, 'full_name'), ' ', 2),
      email: new_.email.getSQL(),
      avatarUrl: extractJson(new_.rawUserMetaData, 'avatar_url'),
      createdBy: new_.id.getSQL(),
    })),
  )
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

const createUserProfile = sql.raw(`private.create_user_profile()`)

/**
 * Create a profile for every user registered
 */
const fn = sql`
  create schema if not exists private;

  create or replace function ${createUserProfile}
  returns trigger as $$
    begin
      ${sql.raw(queryProfileInsert.toSQL().sql)};
      return new;
    end;
  $$ language plpgsql security definer
  set search_path = public;

  create or replace trigger on_auth_user_created
  after insert on ${authUser} for each row
  execute function ${createUserProfile};
`

export default () => db.execute(fn)
