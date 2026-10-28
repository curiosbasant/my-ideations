import { schema } from '@my/db'
import { aliasExcluded } from '@my/db/helpers'
import { and, caseWhen, eq, inArray, isDistinctFrom, now, or } from '@my/db/sql'
import { extractDataFromSheet } from '@my/lib/file'
import { splitFullName } from '@my/lib/utils'
import { z } from '@my/lib/zod'

import { dateSchema, genderSchema, trimmedString } from '../../../lib/utils/sd-schema'
import { adminProcedure } from '../../../trpc'

type RawKeyTeacher =
  | 'Name'
  | 'EmployeeID'
  | 'FatherName'
  | 'Gender'
  | 'DOB'
  | 'Post'
  | 'Subject'
  | 'Date Of Joining'
  | 'Address'
  | 'Aadhar No'
  | 'PAN No'
  | 'Mobile No'
  | 'Blood Group'

const transformRawTeacher = (raw: Record<RawKeyTeacher, string>) => ({
  name: raw.Name,
  employeeId: raw.EmployeeID,
  fName: raw.FatherName.replace(/^(Lt.|Late|L.SHRI|SHRI)/, ''),
  gender: raw.Gender,
  dob: raw.DOB,
  post: raw.Post,
  subject: raw.Subject.replace(/\-+/, ''),
  joiningDate: raw['Date Of Joining'],
  bloodGroup: raw['Blood Group'],
})

const SchemaTeacher = z.object({
  name: trimmedString,
  fName: trimmedString.nullable().catch(null),
  gender: genderSchema,
  dob: dateSchema,
  bloodGroup: trimmedString.nullable().catch(null),
  employeeId: trimmedString,
  post: trimmedString.nullable().catch(null),
  subject: trimmedString.nullable().catch(null),
  joiningDate: dateSchema.nullable().catch(null),
})

type SchemaTeacher = z.infer<typeof SchemaTeacher>

const schemaTeacherArray = z.preprocess(transformRawTeacher, SchemaTeacher).array().nonempty()

export const importFileProcedure = adminProcedure
  .input(
    z.object({
      instituteId: z.string(),
      file: z.instanceof(File),
    }),
  )
  .query(async ({ input, ctx: { rls } }) => {
    const sdRecords = await extractDataFromSheet(input.file).then(schemaTeacherArray.parse)

    return rls(async (tx) => {
      const existingRows = await tx
        .select({
          personId: schema.sd__teacher.personId,
          fatherPersonId: schema.personRelation.relativeId,
          employeeId: schema.sd__teacher.employeeId,
        })
        .from(schema.person)
        .innerJoin(schema.sd__teacher, eq(schema.person.id, schema.sd__teacher.personId))
        .leftJoin(
          schema.personRelation,
          and(
            eq(schema.personRelation.relation, '1'),
            eq(schema.personRelation.personId, schema.person.id),
          ),
        )
        .where(
          and(
            eq(schema.sd__teacher.instituteId, input.instituteId),
            inArray(
              schema.sd__teacher.employeeId,
              sdRecords.map((r) => r.employeeId),
            ),
          ),
        )

      const personRows = await tx
        .insert(schema.person)
        .values(
          sdRecords.flatMap((record) => {
            const row = existingRows.find((e) => e.employeeId === record.employeeId)
            return [
              {
                id: row?.personId,
                ...splitFullName(record.name),
                gender: String(['M', 'F', 'T'].indexOf(record.gender) + 1),
                dob: record.dob.toISOString(),
                bloodGroup: record.bloodGroup,
              },
              {
                id: row?.fatherPersonId ?? undefined,
                ...splitFullName(record.fName ?? ''),
                gender: '1',
              },
            ] satisfies (typeof schema.person.$inferInsert)[]
          }),
        )
        .onConflictDoUpdate(
          aliasExcluded(schema.person, (excluded) => ({
            target: schema.person.id,
            set: {
              firstName: excluded.firstName,
              lastName: excluded.lastName,
              dob: excluded.dob,
              gender: excluded.gender,
              bloodGroup: excluded.bloodGroup,
              updatedAt: caseWhen(
                or(
                  isDistinctFrom(schema.person.firstName, excluded.firstName),
                  isDistinctFrom(schema.person.lastName, excluded.lastName),
                  isDistinctFrom(schema.person.dob, excluded.dob),
                  isDistinctFrom(schema.person.gender, excluded.gender),
                  isDistinctFrom(schema.person.bloodGroup, excluded.bloodGroup),
                ),
                now(),
              ).else(schema.person.updatedAt),
            },
          })),
        )
        .returning({ id: schema.person.id })

      const insertRelationsPromise = tx
        .insert(schema.personRelation)
        .values(
          sdRecords.map((_, i) => ({
            personId: personRows[i * 2]!.id,
            relativeId: personRows[i * 2 + 1]!.id,
            relation: '1',
          })),
        )
        .onConflictDoNothing()

      const insertTeachersPromise = tx
        .insert(schema.sd__teacher)
        .values(
          sdRecords.map((record, i) => ({
            personId: personRows[i * 2]!.id,
            instituteId: input.instituteId,
            employeeId: record.employeeId,
            joiningDate: record.joiningDate?.toISOString(),
          })),
        )
        .onConflictDoUpdate(
          aliasExcluded(schema.sd__teacher, (excluded) => ({
            target: schema.sd__teacher.employeeId,
            set: {
              personId: excluded.personId,
              joiningDate: excluded.joiningDate,
              updatedAt: now(),
            },
            setWhere: or(
              isDistinctFrom(schema.sd__teacher.personId, excluded.personId),
              isDistinctFrom(schema.sd__teacher.joiningDate, excluded.joiningDate),
            ),
          })),
        )

      await Promise.all([insertRelationsPromise, insertTeachersPromise])
    })
  })
