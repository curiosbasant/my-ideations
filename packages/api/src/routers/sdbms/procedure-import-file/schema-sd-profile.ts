import { z } from '@my/lib/zod'

import {
  categorySchema,
  coerceNumber,
  dateSchema,
  genderSchema,
  trimmedString,
} from '../../../lib/utils/sd-schema'

type RawKeyStudent =
  | 'Class'
  | 'Section'
  | 'SRNO'
  | 'DOA'
  | 'Name'
  | 'Late Status'
  | 'FatherName'
  | 'MotherName'
  | 'Gender'
  | 'Dob'
  | 'ClassRollNo'
  | 'ExamRollNumber'
  | 'School Total Working Days'
  | 'Student Total Attendence'
  | 'Category'
  | 'Religion'
  | 'Previous Year Marks'
  | 'Name Of School'
  | 'School UDise Code'
  | 'Aadhar No of Student'
  | 'Bhamashash Card'
  | 'Mobile No Student(Father/Mother/Guardian'
  | 'Student Permanent Address'
  | 'Annual Parental Income'
  | 'CWSN Status'
  | 'BPL Status'
  | 'Minority Status'
  | 'Age On Present(In Years)'
  | 'Co-Curricular Activity'
  | 'Distance From School'

const transformRawStudent = (raw: Record<RawKeyStudent, string>) => ({
  // class specific
  standard: raw.Class,
  section: raw.Section,
  srNo: raw.SRNO,
  doa: raw.DOA,
  rollNo: raw.ClassRollNo,

  // student specific
  name: raw.Name,
  fName: raw.FatherName,
  mName: raw.MotherName,
  dob: raw.Dob,
  gender: raw.Gender,
  category: raw.Category,
  religion: raw.Religion,
  bpl: raw['BPL Status'],
  minority: raw['Minority Status'],
  mobileNo: raw['Mobile No Student(Father/Mother/Guardian'],
  schoolDistance: raw['Distance From School'],
  schoolName: raw['Name Of School'],
})

const schemaStudent = z.object({
  standard: coerceNumber,
  section: trimmedString,
  srNo: trimmedString,
  doa: dateSchema.nullable().catch(null),
  rollNo: coerceNumber.nullable().catch(null),

  name: trimmedString,
  fName: trimmedString,
  mName: trimmedString,
  dob: dateSchema,
  gender: genderSchema,
  category: categorySchema,
  bpl: z
    .literal(['Y', 'N'])
    .transform((v) => v === 'Y')
    .nullable()
    .catch(null),
  minority: z
    .literal(['Yes', 'No'])
    .transform((v) => v === 'Yes')
    .nullable()
    .catch(null),

  religion: trimmedString.nullable().catch(null),
  mobileNo: trimmedString.length(10).nullable().catch(null),
  schoolDistance: coerceNumber.nullable().catch(null),
  schoolName: trimmedString,
})

export const sdStudentSchema = z.preprocess(transformRawStudent, schemaStudent)
export type sdStudentSchema = z.infer<typeof sdStudentSchema>
