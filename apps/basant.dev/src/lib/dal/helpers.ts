import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { TRPCError } from '@trpc/server'

import {
  createErrorReturn,
  createSuccessReturn,
  ThrowableDalError,
  type DalError,
  type DalResult,
} from './types'

export async function dalLoginRedirect<T, E extends DalError>(dalResult: Promise<DalResult<T, E>>) {
  const result = await dalResult
  if (result.success) return result
  if (result.error.type === 'unauthenticated') {
    const head = await headers()

    const pathname = ((header: Headers) => {
      const host = header.get('host')
      const referrer = header.get('referer')
      if (!referrer || !host) return null
      const index = referrer.indexOf(host)
      if (index === -1) return null

      const pathname = referrer.slice(index + host.length)
      return pathname.startsWith('/') ? pathname : null
    })(head)

    return redirect(pathname ? `/?continue=${encodeURIComponent(pathname)}` : '/')
  }

  return result as DalResult<T, Exclude<E, { type: 'unauthenticated' }>>
}

export async function dalUnauthorizedRedirect<T, E extends DalError>(
  dalResult: Promise<DalResult<T, E>>,
  redirectPath = '/',
) {
  const result = await dalResult
  if (result.success) return result
  if (result.error.type === 'unauthorized') return redirect(redirectPath)

  return result as DalResult<T, Exclude<E, { type: 'unauthorized' }>>
}

export async function dalThrowError<T, E extends DalError>(dalResult: Promise<DalResult<T, E>>) {
  const result = await dalResult
  if (result.success) return result
  throw 'error' in result.error ? result.error.error : result.error
}

export async function dalVerifySuccess<T, E extends DalError>(
  dalResult: Promise<DalResult<T, E>>,
  { unauthorizedRedirectPath }: { unauthorizedRedirectPath?: string } = {},
): Promise<T> {
  const result = await dalThrowError(
    dalUnauthorizedRedirect(dalLoginRedirect(dalResult), unauthorizedRedirectPath),
  )
  return result.data
}

export async function dalDbOperation<T>(operation: () => Promise<T>) {
  try {
    const data = await operation()
    return createSuccessReturn(data)
  } catch (e) {
    if (e instanceof ThrowableDalError) {
      return createErrorReturn(e.dalError)
    }
    if (e instanceof TRPCError) {
      if (e.code === 'UNAUTHORIZED') {
        return createErrorReturn({ type: 'unauthenticated' })
      }
      if (e.code === 'FORBIDDEN') {
        return createErrorReturn({ type: 'unauthorized' })
      }
    }
    return createErrorReturn({ type: 'unknown-error', error: e })
  }
}

export function dalFormatErrorMessage(error: DalError) {
  const type = error.type

  switch (type) {
    case 'unauthenticated':
      return 'You must be logged in to access or perform this action.'
    case 'unauthorized':
      return 'You do not have permission to access or perform this action.'
    case 'unknown-error':
      return 'An unknown error occurred'
    default:
      throw new Error(`Unhandled error type: ${type as never}`)
  }
}
