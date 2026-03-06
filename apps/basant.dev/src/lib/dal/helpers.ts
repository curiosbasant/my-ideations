import { cache } from 'react'
import { headers } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import {
  TRPCError,
  type AnyProcedure,
  type inferProcedureInput,
  type inferProcedureOutput,
} from '@trpc/server'

import { SIGN_IN_PATH } from '~/features/shared/constants'
import {
  createErrorReturn,
  createSuccessReturn,
  ThrowableDalError,
  type DalError,
  type DalResult,
} from './shared'

export function dalTrpcQuery<
  TProcedure extends AnyProcedure,
  TInput extends inferProcedureInput<TProcedure>,
  TOutput extends inferProcedureOutput<TProcedure>,
  TResult,
>(
  procedure: (input: TInput) => Promise<TOutput>,
  cb: (op: Promise<DalResult<TOutput, DalError>>) => TResult,
) {
  return cache((payload: TInput) => {
    return cb(dalNotFound(dalDbOperation(() => procedure(payload))))
  })
}

export function dalTrpcAction<
  TProcedure extends AnyProcedure,
  TInput extends inferProcedureInput<TProcedure>,
  TOutput extends inferProcedureOutput<TProcedure>,
  TResult,
>(
  procedure: (input: TInput) => Promise<TOutput>,
  cb: (op: Promise<DalResult<TOutput, DalError>>) => TResult,
) {
  return (payload: TInput) => {
    return cb(dalDbOperation(() => procedure(payload)))
  }
}

export async function dalNotFound<T, E extends DalError>(dalResult: Promise<DalResult<T, E>>) {
  const result = await dalResult
  if (result.success) return result
  if (result.error.type === 'not-found') {
    notFound()
  }

  return result as DalResult<T, Exclude<E, { type: 'not-found' }>>
}

export async function dalLoginRedirect<T, E extends DalError>(dalResult: Promise<DalResult<T, E>>) {
  const result = await dalResult
  if (result.success) return result
  if (result.error.type === 'unauthenticated') {
    const pathname = await guessContinuePath()
    return redirect(SIGN_IN_PATH + (pathname ? `?continue=${encodeURIComponent(pathname)}` : ''))
  }

  return result as DalResult<T, Exclude<E, { type: 'unauthenticated' }>>
}
async function guessContinuePath() {
  const header = await headers()
  const host = header.get('host')
  const referrer = header.get('referer')
  if (!referrer || !host) return null
  const index = referrer.indexOf(host)
  if (index === -1) return null

  const pathname = referrer.slice(index + host.length)
  return pathname.startsWith('/') ? pathname : null
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

export async function dalNullifyError<T, E extends DalError>(dalResult: Promise<DalResult<T, E>>) {
  const result = await dalResult
  return result.success ? result.data : null
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
