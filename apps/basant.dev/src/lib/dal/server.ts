import { cache } from 'react'
import { headers } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import type { AnyProcedure, inferProcedureInput, inferProcedureOutput } from '@trpc/server'

import { SIGN_IN_PATH } from '~/features/shared/constants'
import { dalDbOperation, dalThrowError } from './helpers'
import type { DalError, DalResult } from './types'

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

export async function dalVerifySuccess<T, E extends DalError>(
  dalResult: Promise<DalResult<T, E>>,
  { unauthorizedRedirectPath }: { unauthorizedRedirectPath?: string } = {},
): Promise<T> {
  return dalThrowError(
    dalUnauthorizedRedirect(dalLoginRedirect(dalResult), unauthorizedRedirectPath),
  )
}
