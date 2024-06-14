/**
 * Just to avoid throwing error for non-parsable texts.
 */
export function parseJson(jsonString: string) {
  try {
    return JSON.parse(jsonString)
  } catch (err) {
    return null
  }
}

/**
 * Converts and normalizes the accent characters to normal text.
 */
export const removeAccents = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '')

/**
 * Converts any text to url friendly one.
 */
export const slugify = (text: string) => {
  return removeAccents(text)
    .replace(/([^\w]+|\s+)/g, '-') // Replace space and other characters by hyphen
    .replace(/\-\-+/g, '-') // Replaces multiple hyphens by one hyphen
    .replace(/(^-+|-+$)/g, '') // Remove extra hyphens from beginning or end of the string
    .toLowerCase()
}

/**
 * Will generate an random id with a-z0-9 characters.
 */
export const generateId = (len = 6) =>
  Math.random()
    .toString(36)
    .slice(2, len + 2)

/**
 * Splits the provided array into two parts.
 */
export function splitArray<T>(array: T[], callback: (n: T, i: number) => boolean): [T[], T[]] {
  const truthyArr: T[] = [],
    falsyArr: T[] = []
  for (let i = 0; i < array.length; i++) {
    ;(callback(array[i], i) ? truthyArr : falsyArr).push(array[i])
  }
  return [truthyArr, falsyArr]
}
