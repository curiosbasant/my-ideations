'use server'

import { revalidatePath } from 'next/cache'

import { dalDbOperation, dalFormatErrorMessage, dalLoginRedirect } from '~/lib/dal/helpers'
import { api } from '~/lib/trpc'

export const actionCreateDocument = async (
  payload: Parameters<typeof api.person.document.create>[0],
) => {
  const result = await dalLoginRedirect(dalDbOperation(() => api.person.document.create(payload)))

  return result.success ? revalidatePath('/documents') : dalFormatErrorMessage(result.error)
}

export const actionUpdateDocument = async (
  payload: Parameters<typeof api.person.document.update>[0],
) => {
  const result = await dalLoginRedirect(dalDbOperation(() => api.person.document.update(payload)))

  return result.success ? revalidatePath('/documents') : dalFormatErrorMessage(result.error)
}
