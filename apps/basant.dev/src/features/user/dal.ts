import { cache } from 'react'
import { notFound } from 'next/navigation'
import { TRPCError } from '@trpc/server'

import { api } from '~/lib/trpc'

export const getProfileDetails = cache(async () => {
  try {
    const user = await api.user.get()
    if (!user) notFound()
    return user
  } catch (error) {
    if (error instanceof TRPCError && error.code === 'UNAUTHORIZED') {
      // redirect(LOGIN_PAGE)
    }
    throw error
  }
})
