import {
  and,
  buildConflictSetWhere,
  buildConflictUpdateColumns,
  eq,
  inArray,
  now,
  schema,
  type DbTransaction,
} from '@my/db'
import { extractDataFromSheet } from '@my/lib/file'
import { groupBy } from '@my/lib/utils'
import { z } from '@my/lib/zod'

import { splitFullName } from '../../../lib/utils'
import { adminProcedure } from '../../../trpc'
import { sdProfileSchema } from './schema-sd-profile'

export const importFileProcedure = adminProcedure
  .input(
    z.object({
      sessionId: z.number(),
      file: z.instanceof(File),
    }),
  )
  .query(async ({ input, ctx: { rls } }) => {
    const sdRecords = await extractDataFromSheet(input.file).then(
      sdProfileSchema.array().nonempty().parse,
    )

    await rls(async (tx) => {
      const instituteIds = await createInstitutes(tx, sdRecords)
      const persons = await createPersons(tx, sdRecords, instituteIds)
      await createStudents(tx, sdRecords, input.sessionId, persons)
    })
  })

async function createInstitutes(tx: DbTransaction, sdRecords: sdProfileSchema[]) {
  const instituteEntries = Object.entries(groupBy(sdRecords, 'schoolName'))
  const institutes = await tx
    .insert(schema.sd__institute)
    .values(
      instituteEntries.map(([instituteName]) => ({
        name: instituteName,
      })),
    )
    .onConflictDoUpdate({
      target: schema.sd__institute.name,
      set: {
        updatedAt: now(),
      },
    })
    .returning({
      id: schema.sd__institute.id,
    })
  const instituteIds = institutes.map((i) => i.id)

  for (let i = 0; i < instituteEntries.length; i++) {
    const [, instituteProfiles] = instituteEntries[i]
    const instituteId = instituteIds[i]

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
      .onConflictDoUpdate({
        target: [schema.sd__class.instituteId, schema.sd__class.numeral],
        set: {
          ...buildConflictUpdateColumns(schema.sd__class, ['name', 'stream']),
          updatedAt: now(),
        },
      })
      .returning({ id: schema.sd__class.id })

    const setFieldsClassSection = [
      'name',
    ] satisfies (keyof typeof schema.sd__classSection.$inferInsert)[]
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
        .onConflictDoUpdate({
          target: [schema.sd__classSection.classId, schema.sd__classSection.name],
          set: {
            ...buildConflictUpdateColumns(schema.sd__classSection, setFieldsClassSection),
            updatedAt: now(),
          },
          setWhere: buildConflictSetWhere(schema.sd__classSection, setFieldsClassSection),
        })
        .returning({ id: schema.sd__classSection.id })
    }
  }
  return instituteIds
}

async function createPersons(
  tx: DbTransaction,
  sdRecords: sdProfileSchema[],
  instituteIds: number[],
) {
  const [recordsToInsert, recordsToUpdate] = await tx
    .select({
      personId: schema.sd__student.personId,
      studentAdmissionNo: schema.sd__student.admissionNo,
      schoolName: schema.sd__institute.name,
    })
    .from(schema.person)
    .innerJoin(schema.sd__student, eq(schema.person.id, schema.sd__student.personId))
    .innerJoin(schema.sd__institute, eq(schema.sd__institute.id, schema.sd__student.instituteId))
    .where(inArray(schema.sd__institute.id, instituteIds))
    .then((rows) => {
      const studentMap = rows.reduce(
        (acc, s) => acc.set(s.schoolName + s.studentAdmissionNo, s.personId),
        new Map<string, number>(),
      )
      const recordsToInsert = [],
        recordsToUpdate = []
      for (const record of sdRecords) {
        const studentPersonId = studentMap.get(record.schoolName + record.srNo)
        studentPersonId ?
          recordsToUpdate.push({ studentPersonId, record })
        : recordsToInsert.push(record)
      }
      return [recordsToInsert, recordsToUpdate] as const
    })

  const insertPersons = async () => {
    if (!recordsToInsert.length) return []
    const personsInserted = await tx
      .insert(schema.person)
      .values(
        recordsToInsert.flatMap((record) => {
          const category = ['GEN', 'OBC', 'SC', 'ST'].indexOf(record.category) + 1
          return [
            {
              ...splitFullName(record.name),
              gender: ['M', 'F', 'T'].indexOf(record.gender) + 1,
              category,
              dob: record.dob.toISOString(),
              bpl: record.bpl,
              minority: record.minority,
              contactNo: record.mobileNo,
            },
            {
              ...splitFullName(record.fName),
              gender: 1,
              category,
              bpl: record.bpl,
              contactNo: record.mobileNo,
            },
            {
              ...splitFullName(record.mName),
              gender: 2,
              category,
              bpl: record.bpl,
            },
          ] satisfies (typeof schema.person.$inferInsert)[]
        }),
      )
      .returning({
        id: schema.person.id,
      })

    return personsInserted.map((v) => v.id)
  }
  const updatePersons = async () => {
    if (!recordsToUpdate.length) return []

    const studentPersonIds = recordsToUpdate.map(({ studentPersonId }) => studentPersonId)
    const parentRelations = await tx
      .select()
      .from(schema.personRelation)
      .where(
        and(
          inArray(schema.personRelation.relation, [1, 2]),
          inArray(schema.personRelation.personId, studentPersonIds),
        ),
      )

    const personUpdateValues = recordsToUpdate.flatMap(({ studentPersonId, record }) => {
      const category = ['GEN', 'OBC', 'SC', 'ST'].indexOf(record.category) + 1
      const values: (typeof schema.person.$inferInsert)[] = [
        {
          id: studentPersonId,
          ...splitFullName(record.name),
          gender: ['M', 'F', 'T'].indexOf(record.gender) + 1,
          category,
          dob: record.dob.toISOString(),
          bpl: record.bpl,
          minority: record.minority,
          contactNo: record.mobileNo,
        },
        {
          ...splitFullName(record.fName),
          gender: 1,
          category,
          bpl: record.bpl,
          contactNo: record.mobileNo,
        },
        {
          ...splitFullName(record.mName),
          gender: 2,
          category,
          bpl: record.bpl,
        },
      ]

      const relations = parentRelations.filter(({ personId }) => personId === studentPersonId)

      if (relations.length !== 2) throw new Error('Must be exactly two parents!')
      const [f, m] = relations

      values[f.relation].id = f.relativeId // 1
      values[m.relation].id = m.relativeId // 2
      return values
    })
    const setFieldsPerson = [
      'firstName',
      'lastName',
      'dob',
      'gender',
      'category',
      'bpl',
      'minority',
      'contactNo',
    ] satisfies (keyof typeof schema.person.$inferInsert)[]
    await tx
      .insert(schema.person)
      .values(personUpdateValues)
      .onConflictDoUpdate({
        target: schema.person.id,
        set: {
          ...buildConflictUpdateColumns(schema.person, setFieldsPerson),
          updatedAt: now(),
        },
        setWhere: buildConflictSetWhere(schema.person, setFieldsPerson),
      })
    return personUpdateValues.map((v) => v.id!)
  }

  const [personsInserted, personsUpdated] = await Promise.all([insertPersons(), updatePersons()])
  const allPersonIds = [...personsInserted, ...personsUpdated]

  const studentPersonIds = allPersonIds.filter((_, i) => i % 3 === 0)
  await tx
    .insert(schema.personRelation)
    .values(
      studentPersonIds.flatMap(
        (_, i) =>
          [
            {
              personId: allPersonIds[i * 3],
              relativeId: allPersonIds[i * 3 + 1],
              relation: 1,
            },
            {
              personId: allPersonIds[i * 3],
              relativeId: allPersonIds[i * 3 + 2],
              relation: 2,
            },
          ] satisfies (typeof schema.personRelation.$inferInsert)[],
      ),
    )
    .onConflictDoNothing()
  return studentPersonIds
}

async function createStudents(
  tx: DbTransaction,
  sdRecords: sdProfileSchema[],
  sessionId: number,
  persons: number[],
) {
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
      .innerJoin(schema.sd__classSection, eq(schema.sd__class.id, schema.sd__classSection.classId))
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
    sdRecords.map(async (record, i) => {
      const { instituteId } = await getData(record.schoolName, record.standard, record.section)

      return {
        personId: persons[i],
        instituteId,
        admissionDate: record.doa?.toISOString(),
        admissionNo: record.srNo,
        distanceKm: record.schoolDistance && Math.round(record.schoolDistance),
      } satisfies typeof schema.sd__student.$inferInsert
    }),
  )

  const students = await tx
    .insert(schema.sd__student)
    .values(studentValues)
    .onConflictDoUpdate({
      target: [schema.sd__student.instituteId, schema.sd__student.admissionNo],
      set: {
        ...buildConflictUpdateColumns(schema.sd__student, [
          'personId',
          'admissionDate',
          'distanceKm',
        ]),
        updatedAt: now(),
      },
    })
    .returning({ id: schema.sd__student.id })

  const classStudentValues = await Promise.all(
    sdRecords.map(async (record, i) => {
      const { instituteId, classId, sectionId } = await getData(
        record.schoolName,
        record.standard,
        record.section,
      )
      return {
        sessionId,
        instituteId,
        classId,
        sectionId,
        studentId: students[i].id,
        rollNo: record.rollNo,
      } satisfies typeof schema.sd__classStudent.$inferInsert
    }),
  )

  const setFieldsClassStudent = [
    'rollNo',
  ] satisfies (keyof typeof schema.sd__classStudent.$inferInsert)[]
  await tx
    .insert(schema.sd__classStudent)
    .values(classStudentValues)
    .onConflictDoUpdate({
      target: [
        schema.sd__classStudent.sessionId,
        schema.sd__classStudent.instituteId,
        schema.sd__classStudent.classId,
        schema.sd__classStudent.sectionId,
        schema.sd__classStudent.studentId,
      ],
      set: {
        ...buildConflictUpdateColumns(schema.sd__classStudent, setFieldsClassStudent),
        updatedAt: now(),
      },
      setWhere: buildConflictSetWhere(schema.sd__classStudent, setFieldsClassStudent),
    })
    .returning({ id: schema.sd__classStudent.id })
}
