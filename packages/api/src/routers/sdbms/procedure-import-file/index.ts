import { and, eq, schema, sql } from '@my/db'
import { extractDataFromSheet } from '@my/lib/file'
import { groupBy } from '@my/lib/utils'
import { z } from '@my/lib/zod'

import { splitFullName } from '../../../lib/utils'
import { protectedProcedure } from '../../../trpc'
import { sdProfileSchema } from './schema-sd-profile'

export const importFileProcedure = protectedProcedure
  .input(
    z.object({
      sessionId: z.number(),
      file: z.instanceof(File),
    }),
  )
  .query(async ({ input, ctx: { db, rls } }) => {
    const truncateQuery = sql`
      truncate table ${schema.sd__institute}
      restart identity
      cascade;
      delete from ${schema.person};
      alter table ${schema.person} alter column id restart with 1;
    `
    const rawProfilesPromise = extractDataFromSheet(input.file).then(sdProfileSchema.array().parse)
    const [rawProfiles] = await Promise.all([rawProfilesPromise, db.execute(truncateQuery)])

    await rls(async (tx) => {
      const createPersons = async () => {
        const persons = await tx
          .insert(schema.person)
          .values(
            rawProfiles.flatMap((s) => {
              const sName = splitFullName(s.name)
              const fName = splitFullName(s.fName)
              const mName = splitFullName(s.mName)
              const category = ['GEN', 'OBC', 'SC', 'ST'].indexOf(s.category) + 1
              return [
                {
                  firstName: sName.firstName,
                  lastName: sName.lastName,
                  gender: ['M', 'F', 'T'].indexOf(s.gender) + 1,
                  category,
                  dob: s.dob.toISOString(),
                  bpl: s.bpl,
                  minority: s.minority,
                  contactNo: s.mobileNo,
                },
                {
                  firstName: fName.firstName,
                  lastName: fName.lastName,
                  gender: 1,
                  category,
                  contactNo: s.mobileNo,
                },
                {
                  firstName: mName.firstName,
                  lastName: mName.lastName,
                  gender: 2,
                  category,
                },
              ] satisfies (typeof schema.person.$inferInsert)[]
            }),
          )
          .returning({ id: schema.person.id })

        await tx.insert(schema.personRelation).values(
          rawProfiles.flatMap<typeof schema.personRelation.$inferInsert>((_, i) => [
            {
              personId: persons[i * 3].id,
              relativeId: persons[i * 3 + 1].id,
              relation: 1,
            },
            {
              personId: persons[i * 3].id,
              relativeId: persons[i * 3 + 2].id,
              relation: 2,
            },
          ]),
        )
        return persons
      }

      const createInstitutes = async () => {
        const instituteEntries = Object.entries(groupBy(rawProfiles, 'schoolName'))
        const institutes = await tx
          .insert(schema.sd__institute)
          .values(
            instituteEntries.map(([instituteName]) => ({
              name: instituteName,
            })),
          )
          .returning({
            instituteId: schema.sd__institute.id,
            instituteName: schema.sd__institute.name,
          })

        for (let i = 0; i < instituteEntries.length; i++) {
          const [, instituteProfiles] = instituteEntries[i]
          const { instituteId } = institutes[i]

          // create all classes in those institutes
          const classEntries = Object.entries(groupBy(instituteProfiles, 'standard'))
          const classes = await tx
            .insert(schema.sd__class)
            .values(
              classEntries.map(([standard]) => ({
                instituteId,
                numeral: +standard,
                name: `Class ${standard}`,
                stream: +standard > 10 ? 1 : null, // Assuming Arts
              })),
            )
            .returning({ id: schema.sd__class.id })

          for (let i = 0; i < classEntries.length; i++) {
            const [, classProfiles] = classEntries[i]
            const classId = classes[i].id

            const sectionEntries = Object.entries(groupBy(classProfiles, 'section'))
            // create all sections in those classes
            await tx
              .insert(schema.sd__classSection)
              .values(
                sectionEntries.map(([sectionName]) => ({
                  classId,
                  name: sectionName,
                })),
              )
              .returning({ id: schema.sd__classSection.id })
          }
        }
      }

      const createStudents = async (persons: { id: number }[]) => {
        const cache = new Map<string, Record<'instituteId' | 'classId' | 'sectionId', number>>()
        const getData = async (instituteName: string, standard: number, sectionName: string) => {
          const key = standard + sectionName + instituteName
          const v = cache.get(key)
          if (v) return v

          const [data] = await tx
            .select({
              instituteId: schema.sd__institute.id,
              classId: schema.sd__class.id,
              sectionId: schema.sd__classSection.id,
            })
            .from(schema.sd__institute)
            .innerJoin(schema.sd__class, eq(schema.sd__institute.id, schema.sd__class.instituteId))
            .innerJoin(
              schema.sd__classSection,
              eq(schema.sd__class.id, schema.sd__classSection.classId),
            )
            .where(
              and(
                eq(schema.sd__institute.name, instituteName),
                eq(schema.sd__class.numeral, standard),
                eq(schema.sd__classSection.name, sectionName),
              ),
            )
          cache.set(key, data)
          return data
        }

        const studentValues = await Promise.all(
          rawProfiles.map(async (s, i) => {
            const { instituteId } = await getData(s.schoolName, s.standard, s.section)

            return {
              personId: persons[i * 3].id,
              instituteId,
              admissionDate: s.doa?.toISOString(),
              admissionNo: s.srNo,
              distanceKm: s.schoolDistance && Math.round(s.schoolDistance),
            } satisfies typeof schema.sd__student.$inferInsert
          }),
        )
        const students = await tx
          .insert(schema.sd__student)
          .values(studentValues)
          .returning({ id: schema.sd__student.id })

        const classStudentValues = await Promise.all(
          rawProfiles.map(async (s, i) => {
            const { instituteId, classId, sectionId } = await getData(
              s.schoolName,
              s.standard,
              s.section,
            )
            return {
              sessionId: input.sessionId,
              instituteId,
              classId,
              sectionId,
              studentId: students[i].id,
              rollNo: s.rollNo,
            } satisfies typeof schema.sd__classStudent.$inferInsert
          }),
        )
        await tx
          .insert(schema.sd__classStudent)
          .values(classStudentValues)
          .returning({ id: schema.sd__classStudent.id })
      }

      const [persons] = await Promise.all([createPersons(), createInstitutes()])
      await createStudents(persons)
    })
  })
