'use server'

import { revalidatePath } from 'next/cache'

import { dalDbOperation, dalTrpcAction, dalVerifySuccess } from '~/lib/dal/helpers'
import { api } from '~/lib/trpc'

export const actionUploadSnapFile = dalTrpcAction(api.snapfile.upload, dalVerifySuccess)

export async function actionCreateFormat(
  payload: Parameters<typeof api.snapfile.format.create>[0],
) {
  await dalVerifySuccess(dalDbOperation(() => api.snapfile.format.create(payload)))
  revalidatePath('/formats')
}
