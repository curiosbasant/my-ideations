import { z } from '@my/lib/zod'

const trimmedString = z.string().trim().nonempty()
const dateSchema = trimmedString.transform(parseDDMMYYY).pipe(z.date())
const coerceNumber = trimmedString.pipe(z.coerce.number())

const sdSchema = z.object({
  standard: coerceNumber,
  section: trimmedString,
  srNo: trimmedString,
  doa: dateSchema.nullable().catch(null),
  rollNo: coerceNumber.nullable().catch(null),

  name: trimmedString,
  fName: trimmedString,
  mName: trimmedString,
  dob: dateSchema,
  gender: z.literal(['M', 'F', 'T']),
  category: z.literal(['GEN', 'OBC', 'SC', 'ST']),
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

function parseDDMMYYY(value: string) {
  const parts = value.split(/-|\//)
  if (parts.length !== 3) return null

  const day = Number.parseInt(parts[0], 10)
  const month = Number.parseInt(parts[1], 10) - 1 // JS months are 0-indexed
  const year = Number.parseInt(parts[2], 10)

  if (isNaN(day) || isNaN(month) || isNaN(year)) return null

  let resolvedYear = year
  if (resolvedYear < 100) {
    const currentYear = new Date().getFullYear()
    const centuryBase = Math.floor(currentYear / 100) * 100
    resolvedYear += centuryBase
    if (resolvedYear > currentYear) {
      resolvedYear -= 100
    }
  }

  const date = new Date(Date.UTC(resolvedYear, month, day))
  // Validate the date was created correctly
  if (date.getFullYear() !== resolvedYear || date.getMonth() !== month || date.getDate() !== day) {
    return null
  }

  return date
}

type ShalaDarpanProfileRawKey =
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

const transformRawProfile = (raw: Record<ShalaDarpanProfileRawKey, string>) => ({
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

export const sdProfileSchema = z.preprocess(transformRawProfile, sdSchema)
export type sdProfileSchema = z.infer<typeof sdProfileSchema>
