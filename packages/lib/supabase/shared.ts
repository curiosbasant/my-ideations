export function throwOnError<T>({ data, error }: { data: T; error: any }) {
  if (error) throw error
  return data
}
