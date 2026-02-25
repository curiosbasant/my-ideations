'use server'

import { revalidatePath } from 'next/cache'

import { dalDbOperation, dalVerifySuccess } from '~/lib/dal/helpers'
import { api } from '~/lib/trpc'

export async function actionCreateFormat(
  payload: Parameters<typeof api.snapfile.format.create>[0],
) {
  await dalVerifySuccess(dalDbOperation(() => api.snapfile.format.create(payload)))
  revalidatePath('/formats')
}
