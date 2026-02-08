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
