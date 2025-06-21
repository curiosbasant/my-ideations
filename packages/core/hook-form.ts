export * from 'react-hook-form'
export { zodResolver, type Resolver as ZodResolver } from '@hookform/resolvers/zod'

export function getDirtyFields<T extends Record<string, any>>(
  formValues?: T | null,
  dirtyFields?: Convert<T>,
) {
  if (typeof dirtyFields !== 'object' || dirtyFields === null || !formValues) {
    return {}
  }

  return Object.entries(dirtyFields).reduce(
    (accumulator, [key, dirtyValue]) => {
      const value = formValues[key]

      // If it's an array, apply the logic recursively to each item
      if (Array.isArray(dirtyValue)) {
        // @ts-expect-error
        const _dirtyFields = dirtyValue.map((item, index) => getDirtyFields(item, value[index]))
        if (_dirtyFields.length > 0) {
          accumulator[key] = _dirtyFields
        }
      }
      // If it's an object, apply the logic recursively
      else if (typeof dirtyValue === 'object' && dirtyValue !== null) {
        accumulator[key] = getDirtyFields(dirtyValue, value)
      }
      // If it's a dirty field, get the value from formValues
      else if (dirtyValue) {
        accumulator[key] = value
      }

      return accumulator
    },
    {} as Record<string, any>,
  )
}

type Convert<T> =
  T extends (infer R)[] ? Convert<R>[]
  : T extends Record<string, any> ? { [P in keyof T]?: Convert<T[P]> }
  : boolean
