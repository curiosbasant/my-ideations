'use server'

import { revalidatePath } from 'next/cache'

import { dalTrpcAction, dalVerifySuccess } from '~/lib/dal/helpers'
import { api } from '~/lib/trpc'

export const actionUploadSnapFile = dalTrpcAction(api.snapfile.create, dalVerifySuccess)

export const actionCreateFormat = dalTrpcAction(api.snapfile.format.create, async (operation) => {
  const data = await dalVerifySuccess(operation)
  revalidatePath('/formats')
  return data
})
