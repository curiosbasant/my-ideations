'use server'

import { revalidatePath } from 'next/cache'

import { api } from '~/lib/trpc'
import { createAction } from '~/lib/utils/helper-action/shared'

export const importFileAction = createAction(async (payload: { sessionId: number; file: File }) => {
  await api.sdbms.student.importFile(payload)
})

export const connectProfileAction = createAction(async (payload: { srNo: string; dob: string }) => {
  await api.sdbms.student.connectProfile(payload)
  revalidatePath('/')
})
