import { TRPCError } from '@trpc/server'

import {
  createErrorReturn,
  createSuccessReturn,
  ThrowableDalError,
  type DalError,
  type DalResult,
} from './types'

export async function dalDbOperation<T>(operation: () => Promise<T>) {
  try {
    const data = await operation()
    return createSuccessReturn(data)
  } catch (e) {
    if (e instanceof ThrowableDalError) {
      return createErrorReturn(e.dalError)
    }
    if (e instanceof TRPCError) {
      switch (e.code) {
        case 'UNAUTHORIZED':
          return createErrorReturn({ type: 'unauthenticated' })
        case 'FORBIDDEN':
          return createErrorReturn({ type: 'unauthorized' })
        case 'CONFLICT':
          return createErrorReturn({ type: 'conflict' })
        case 'NOT_FOUND':
          return createErrorReturn({ type: 'not-found', error: e })
      }
    }
    return createErrorReturn({ type: 'unknown-error', error: e })
  }
}

export async function dalThrowError<T, E extends DalError>(dalResult: Promise<DalResult<T, E>>) {
  const result = await dalResult
  if (result.success) return result.data
  throw 'error' in result.error ? result.error.error : result.error
}

export async function dalNullifyError<T, E extends DalError>(dalResult: Promise<DalResult<T, E>>) {
  const result = await dalResult
  return result.success ? result.data : null
}

export function dalFormatErrorMessage(error: DalError): string {
  const type = error.type

  switch (type) {
    case 'unauthenticated':
      return 'You must be logged in to access or perform this action.'
    case 'unauthorized':
      return 'You do not have permission to access or perform this action.'
    case 'conflict':
      return 'That resource already exists.'
    case 'not-found':
      return error.error?.message || 'That resource is not available.'
    case 'unknown-error':
      return 'An unknown error occurred'
    default:
      throw new Error(`Unhandled error type: ${type satisfies never}`)
  }
}
