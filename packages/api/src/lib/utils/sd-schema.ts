import { z } from '@my/lib/zod'

export const categorySchema = z.literal(['GEN', 'OBC', 'SC', 'ST'])
export const genderSchema = z.literal(['M', 'F', 'T'])
export const trimmedString = z.string().trim().nonempty()
export const coerceNumber = trimmedString.pipe(z.coerce.number()).or(z.number())
export const coerceString = z.number().pipe(z.coerce.string()).or(trimmedString)

const MS_PER_DAY = 86400 * 1000
const EXCEL_EPOCH_OFFSET = 25569
export const dateSchema = z
  .union([
    z.number().transform((v) => new Date((v - EXCEL_EPOCH_OFFSET) * MS_PER_DAY)),
    trimmedString.transform(ddmmyyyyParser),
  ])
  .pipe(z.date())

function ddmmyyyyParser(value: string) {
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
