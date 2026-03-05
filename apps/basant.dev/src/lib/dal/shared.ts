export type DalResult<T, E extends DalError = DalError> =
  | {
      success: true
      data: T
    }
  | {
      success: false
      error: E
    }

export type DalError =
  | {
      type: 'unauthenticated'
    }
  | {
      type: 'unauthorized'
    }
  | {
      type: 'conflict'
    }
  | {
      type: 'not-found'
      error: Error
    }
  | {
      type: 'unknown-error'
      error: unknown
    }

export class ThrowableDalError extends Error {
  dalError: DalError

  constructor(dalError: DalError) {
    super('ThrowableDalError')
    this.dalError = dalError
  }
}

export function createSuccessReturn<T>(data: T): DalResult<T> {
  return { success: true, data }
}

export function createErrorReturn<E extends DalError>(error: E): DalResult<never> {
  return { success: false, error }
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
      throw new Error(`Unhandled error type: ${type as never}`)
  }
}
