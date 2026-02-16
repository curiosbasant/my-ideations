import { index, pgPolicy, uniqueIndex, type PgColumn } from 'drizzle-orm/pg-core'
import { eq, inArray } from 'drizzle-orm/sql'
import { authenticatedRole } from 'drizzle-orm/supabase'

import { authUserPersonId } from '../../utils/fn-helpers'
import { id, withCommonColumns } from '../../utils/pg-column-helpers'
import {
  policyAllowAuthenticatedInsert,
  policyAllowAuthenticatedSelect,
} from '../../utils/pg-table-helpers'
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

const currentTeacher = qb
  .select({ id: sd__teacher.id })
  .from(sd__teacher)
  .where(eq(sd__teacher.personId, authUserPersonId))

export const policyAllowTeacherSelect = (teacherId: PgColumn) =>
  pgPolicy('Allow select to teacher', {
    for: 'select',
    to: authenticatedRole,
    using: inArray(teacherId, currentTeacher),
  })

export const policyAllowTeacherInsert = (teacherId: PgColumn) =>
  pgPolicy('Allow insert to teacher', {
    for: 'insert',
    to: authenticatedRole,
    withCheck: inArray(teacherId, currentTeacher),
  })

export const policyAllowTeacherUpdate = (teacherId: PgColumn) =>
  pgPolicy('Allow update to teacher', {
    for: 'update',
    to: authenticatedRole,
    using: inArray(teacherId, currentTeacher),
  })
