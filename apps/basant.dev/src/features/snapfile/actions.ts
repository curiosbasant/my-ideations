'use server'

import { revalidatePath } from 'next/cache'

import { dalThrowError } from '~/lib/dal/helpers'
import { dalTrpcAction, dalVerifySuccess } from '~/lib/dal/server'
import { api } from '~/lib/trpc'

export const actionUploadSnapFile = dalTrpcAction(api.snapfile.create, dalVerifySuccess)
export const actionUploadRoomFile = dalTrpcAction(
  api.snapfile.room.file.create,
  async (operation) => {
    const data = await dalThrowError(operation)
    revalidatePath('/rooms')
    return data
  },
)

export const actionCreateFormat = dalTrpcAction(api.snapfile.format.create, async (operation) => {
  const data = await dalVerifySuccess(operation)
  revalidatePath('/formats')
  return data
})
