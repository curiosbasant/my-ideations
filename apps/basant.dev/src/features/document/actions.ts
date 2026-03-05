'use server'

import { revalidatePath } from 'next/cache'

import { dalLoginRedirect, dalTrpcAction } from '~/lib/dal/helpers'
import { api } from '~/lib/trpc'

export const actionCreateDocument = dalTrpcAction(api.person.document.create, async (operation) => {
  const result = await dalLoginRedirect(operation)
  result.success && revalidatePath('/documents')
  return result
})

export const actionUpdateDocument = dalTrpcAction(api.person.document.update, async (operation) => {
  const result = await dalLoginRedirect(operation)
  result.success && revalidatePath('/documents')
  return result
})
