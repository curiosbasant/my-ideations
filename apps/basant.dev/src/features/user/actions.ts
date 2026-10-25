'use server'

import { revalidatePath } from 'next/cache'

import { dalLoginRedirect, dalTrpcAction } from '~/lib/dal/server'
import { api } from '~/lib/trpc'

export const getDepartmentDesignations = dalTrpcAction(
  api.user.department.designation.list,
  dalLoginRedirect,
)

export const saveDesignation = dalTrpcAction(api.user.department.update, async (operation) => {
  const result = await dalLoginRedirect(operation)
  revalidatePath('/')
  return result
})
