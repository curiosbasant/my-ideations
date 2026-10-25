'use server'

import { redirect } from 'next/navigation'

import { dalTrpcAction } from '~/lib/dal/server'
import { api } from '~/lib/trpc'

export const actionSignInWithProvider = dalTrpcAction(
  api.auth.signInWithProvider,
  async (operation) => {
    const result = await operation
    if (result.success && result.data.redirectUrl) redirect(result.data.redirectUrl)
    return result
  },
)
