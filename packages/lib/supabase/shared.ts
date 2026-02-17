import { ROOT_HOSTNAME } from '../constants'

export function throwOnError<T>({ data, error }: { data: T; error: any }) {
  if (error) throw error
  return data
}

export async function withThrowOnError<T>(
  promise: Promise<{ data: T; error: null } | { data: unknown; error: Error }>,
): Promise<T> {
  const { data, error } = await promise
  if (error) throw error
  return data
}

export const cookieOptions = {
  domain: ROOT_HOSTNAME,
  secure: process.env['NODE_ENV'] === 'production',
}
