import { index, pgPolicy, uniqueIndex, type PgColumn } from 'drizzle-orm/pg-core'
import { and, eq, exists } from 'drizzle-orm/sql'
import { authenticatedRole } from 'drizzle-orm/supabase'

import { selectPersonId } from '../../utils/helpers/db-functions'
import {
  policyAllowAuthenticatedInsert,
  policyAllowAuthenticatedSelect,
} from '../../utils/helpers/policy'
import { id, withCommonColumns } from '../../utils/pg-column-helpers'
import { qb } from '../../utils/qb'
import { person } from '../person'
import { pgTable } from './_helpers'
import { sd__institute } from './institute'

export const sd__teacher = pgTable(
  'teacher',
  withCommonColumns((c) => ({
    personId: id.references(() => person.id).notNull(),
    instituteId: id.references(() => sd__institute.id).notNull(),
    employeeId: c.varchar().unique(),
    joiningDate: c.date(),
  })),
  (t) => [
    uniqueIndex().on(t.personId),
    index().on(t.instituteId),
    index().on(t.createdAt.desc()),
    policyAllowAuthenticatedSelect,
    policyAllowAuthenticatedInsert,
  ],
)

const checkIfTeacherWithId = (teacherId: PgColumn) =>
  exists(
    qb
      .select()
      .from(sd__teacher)
      .where(and(eq(sd__teacher.personId, selectPersonId), eq(sd__teacher.id, teacherId))),
  )

export const policyAllowTeacherSelectOwn = (teacherId: PgColumn) =>
  pgPolicy('allow_teacher_select_own', {
    as: 'permissive',
    for: 'select',
    to: authenticatedRole,
    using: checkIfTeacherWithId(teacherId),
  })

export const policyAllowTeacherInsertOwn = (teacherId: PgColumn) =>
  pgPolicy('allow_teacher_insert_own', {
    as: 'permissive',
    for: 'insert',
    to: authenticatedRole,
    withCheck: checkIfTeacherWithId(teacherId),
  })

export const policyAllowTeacherUpdateOwn = (teacherId: PgColumn) =>
  pgPolicy('allow_teacher_update_own', {
    as: 'permissive',
    for: 'update',
    to: authenticatedRole,
    using: checkIfTeacherWithId(teacherId),
  })
