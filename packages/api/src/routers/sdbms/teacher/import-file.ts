import { schema } from '@my/db'
import { aliasExcluded } from '@my/db/helpers'
import { and, eq, inArray, isDistinctFrom, now, or } from '@my/db/sql'
import { splitFullName } from '@my/lib/utils'
import { extractDataFromSheet } from '@my/lib/utils/file'
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
  fName: raw.FatherName.replace(/^(Late|L.SHRI|SHRI) /, ''),
  gender: raw.Gender,
  dob: raw.DOB,
  post: raw.Post,
  subject: raw.Subject.replace(/\-+/, ''),
  joiningDate: raw['Date Of Joining'],
  bloodGroup: raw['Blood Group'],
})

const SchemaTeacher = z.object({
  name: trimmedString,
  fName: trimmedString,
  gender: genderSchema,
  dob: dateSchema,
  bloodGroup: trimmedString,
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
      const [recordsToInsert, recordsToUpdate] = await tx
        .select({
          personId: schema.sd__teacher.personId,
          employeeId: schema.sd__teacher.employeeId,
        })
        .from(schema.person)
        .innerJoin(schema.sd__teacher, eq(schema.person.id, schema.sd__teacher.personId))
        .where(
          and(
            eq(schema.sd__teacher.instituteId, input.instituteId),
            inArray(
              schema.sd__teacher.employeeId,
              sdRecords.map((r) => r.employeeId),
            ),
          ),
        )
        .then(async (rows) => {
          const teachersMap = rows.reduce(
            (acc, s) => acc.set(s.employeeId!, s.personId),
            new Map<string, string>(),
          )
          const recordsToInsert = [],
            recordsToUpdate = []

          for (const record of sdRecords) {
            const teacherPersonId = teachersMap.get(record.employeeId)
            teacherPersonId ?
              recordsToUpdate.push({ teacherPersonId, record })
            : recordsToInsert.push(record)
          }
          return [recordsToInsert, recordsToUpdate] as const
        })

      const insertPersons = async () => {
        if (!recordsToInsert.length) return []
        const personsInserted = await tx
          .insert(schema.person)
          .values(
            recordsToInsert.flatMap(
              (record) =>
                [
                  {
                    ...splitFullName(record.name),
                    gender: String(['M', 'F', 'T'].indexOf(record.gender) + 1),
                    dob: record.dob.toISOString(),
                    bloodGroup: record.bloodGroup,
                  },
                  {
                    ...splitFullName(record.fName),
                    gender: '1',
                  },
                ] satisfies (typeof schema.person.$inferInsert)[],
            ),
          )
          .returning({
            id: schema.person.id,
          })

        return personsInserted.map((v) => v.id)
      }
      const updatePersons = async () => {
        if (!recordsToUpdate.length) return []

        const personIds = recordsToUpdate.map((r) => r.teacherPersonId)
        const parentRelations = await tx
          .select()
          .from(schema.personRelation)
          .where(
            and(
              eq(schema.personRelation.relation, '1'),
              inArray(schema.personRelation.personId, personIds),
            ),
          )

        const personUpdateValues = recordsToUpdate.flatMap(({ teacherPersonId, record }) => {
          const values: (typeof schema.person.$inferInsert)[] = [
            {
              id: teacherPersonId,
              ...splitFullName(record.name),
              gender: String(['M', 'F', 'T'].indexOf(record.gender) + 1),
              dob: record.dob.toISOString(),
              bloodGroup: record.bloodGroup,
            },
            {
              ...splitFullName(record.fName),
              gender: '1',
            },
          ]

          const f = parentRelations.find(({ personId }) => personId === teacherPersonId)
          f && (values[+f.relation].id = f.relativeId) // 1
          return values
        })
        await tx
          .insert(schema.person)
          .values(personUpdateValues)
          .onConflictDoUpdate(
            aliasExcluded(schema.person, (excluded) => ({
              target: schema.person.id,
              set: {
                firstName: excluded.firstName,
                lastName: excluded.lastName,
                dob: excluded.dob,
                gender: excluded.gender,
                bloodGroup: excluded.bloodGroup,
                updatedAt: now(),
              },
              setWhere: or(
                isDistinctFrom(schema.person.firstName, excluded.firstName),
                isDistinctFrom(schema.person.lastName, excluded.lastName),
                isDistinctFrom(schema.person.dob, excluded.dob),
                isDistinctFrom(schema.person.gender, excluded.gender),
                isDistinctFrom(schema.person.bloodGroup, excluded.bloodGroup),
              ),
            })),
          )
        return personUpdateValues.map((v) => v.id!)
      }

      const [personsInserted, personsUpdated] = await Promise.all([
        insertPersons(),
        updatePersons(),
      ])
      const allPersonIds = [...personsInserted, ...personsUpdated]
      const teacherPersonIds = allPersonIds.filter((_, i) => i % 2 === 0)

      const insertRelationsPromise = tx
        .insert(schema.personRelation)
        .values(
          teacherPersonIds.map((_, i) => ({
            personId: allPersonIds[i * 2],
            relativeId: allPersonIds[i * 2 + 1],
            relation: '1',
          })),
        )
        .onConflictDoNothing()

      const insertTeachersPromise = tx
        .insert(schema.sd__teacher)
        .values(
          recordsToInsert
            .map((record, i) => ({
              personId: personsInserted[i * 2],
              instituteId: input.instituteId,
              employeeId: record.employeeId,
              joiningDate: record.joiningDate?.toISOString(),
            }))
            .concat(
              recordsToUpdate.map(({ teacherPersonId, record }) => ({
                personId: teacherPersonId,
                instituteId: input.instituteId,
                employeeId: record.employeeId,
                joiningDate: record.joiningDate?.toISOString(),
              })),
            ),
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
