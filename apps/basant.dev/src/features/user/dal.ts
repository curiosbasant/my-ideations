import { cache } from 'react'

import { dalDbOperation } from '~/lib/dal/helpers'
import { api } from '~/lib/trpc'

export const getProfileDetails = cache(async () => {
  const result = await dalDbOperation(() => api.user.get())
  if (result.success) return result.data || null
  if (result.error.type === 'unauthenticated') return null

  throw 'error' in result.error ? result.error.error : result.error
})

export const getDepartments = cache(() => {
  return api.user.department.list()
})
