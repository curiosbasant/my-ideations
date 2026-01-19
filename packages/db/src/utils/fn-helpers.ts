import { sql } from 'drizzle-orm'

import { person } from '../schema/person'
import { concatWs, nullIf } from './pg-functions'

export const authUserPersonId = sql<number>`get_auth_user_person_id()`
export const authUserProfileId = sql<number>`get_auth_user_profile_id()`

export const personFullName = () =>
  nullIf<string>(concatWs(' ', person.firstName, person.lastName), '')
