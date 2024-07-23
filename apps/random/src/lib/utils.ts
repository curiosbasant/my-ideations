import { TRPCError } from '@trpc/server'

import { safeParseText } from '@my/lib/utils'
import { z, ZodError } from '@my/lib/zod'

import { IS_BROWSER } from '~/lib/constants'
import { env } from '~/lib/env'

export function ReturnNull() {
  return null
}

export function getCountDownText(ms: number) {
  if (ms <= 0) return null

  let timeUnit = ms / 1000
  const getText = (baseUnit: number, t: string) => {
    const temp = timeUnit
    timeUnit = (timeUnit / baseUnit) | 0
    return timeUnit < 1 ? `${temp} ${t}${temp === 1 ? '' : 's'}` : null
  }

  return getText(60, 'sec') ?? getText(60, 'min') ?? getText(24, 'hour') ?? getText(30, 'day')
}

export function getBaseUrl() {
  if (IS_BROWSER) return window.location.origin
  if (env.VERCEL_URL) return env.VERCEL_URL
  return `http://localhost:${env.PORT}`
}

export const apiCallWrapper = <T extends object>(promise: Promise<T>) =>
  promise
    .catch((error: unknown) => {
      if (error instanceof TRPCError) {
        if (error.cause instanceof ZodError) {
          const { formErrors, fieldErrors } = error.cause.flatten()
          return {
            errors: {
              root: formErrors,
              ...fieldErrors,
            },
          }
        } else {
          const data = safeParseText(z.record(z.string(), z.string().array()), error.message)
          if (data) return { errors: data }
        }
      }
      throw error
    })
    .then((data) => ('errors' in data ? { ...data, data: null } : { data, errors: null }))

export const router = {
  push: (url: string | URL) => window.history.pushState(null, '', url),
  replace: (url: string | URL) => window.history.replaceState(null, '', url),
  setSearchParam(paramName: string, value: unknown) {
    const params = new URLSearchParams(window.location.search)
    if (value || value === 0) {
      params.set(paramName, String(value))
    } else {
      params.delete(paramName)
    }
    window.history.replaceState(null, '', '?' + params)
  },
}
