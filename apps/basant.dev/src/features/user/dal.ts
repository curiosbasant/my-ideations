import { cache } from 'react'
import { TRPCError } from '@trpc/server'

import { api } from '~/lib/trpc'

export const getProfileDetails = cache(async () => {
  try {
    const user = await api.user.get()
    if (!user) return null
    return user
  } catch (error) {
    if (error instanceof TRPCError && error.code === 'UNAUTHORIZED') {
      return null
    }
    throw error
  }
})

export const getDepartments = cache(() => {
  return api.user.department.list()
})
