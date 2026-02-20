'use server'

import { revalidatePath } from 'next/cache'

import { api } from '~/lib/trpc'

export const actionAddDocument = async (payload: Parameters<typeof api.person.document.set>[0]) => {
  await api.person.document.set(payload)
  revalidatePath('/documents')
}
