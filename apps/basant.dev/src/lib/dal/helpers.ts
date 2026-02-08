import { redirect } from 'next/navigation'
import { TRPCError } from '@trpc/server'

import {
  createErrorReturn,
  createSuccessReturn,
  ThrowableDalError,
  type DalError,
  type DalResult,
} from './types'

export function dalLoginRedirect<T, E extends DalError>(dalResult: DalResult<T, E>) {
  if (dalResult.success) return dalResult
  if (dalResult.error.type === 'unauthenticated') return redirect('/')

  return dalResult as DalResult<T, Exclude<E, { type: 'unauthenticated' }>>
}

export function dalUnauthorizedRedirect<T, E extends DalError>(
  dalResult: DalResult<T, E>,
  redirectPath = '/',
) {
  if (dalResult.success) return dalResult
  if (dalResult.error.type === 'unauthorized') return redirect(redirectPath)

  return dalResult as DalResult<T, Exclude<E, { type: 'unauthorized' }>>
}

export function dalThrowError<T, E extends DalError>(dalResult: DalResult<T, E>) {
  if (dalResult.success) return dalResult
  throw 'error' in dalResult.error ? dalResult.error.error : dalResult.error
}

export function dalVerifySuccess<T, E extends DalError>(
  dalResult: DalResult<T, E>,
  { unauthorizedRedirectPath }: { unauthorizedRedirectPath?: string } = {},
): T {
  const result = dalThrowError(
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
