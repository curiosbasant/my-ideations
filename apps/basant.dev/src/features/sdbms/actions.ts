'use server'

import { revalidatePath } from 'next/cache'

import { api } from '~/lib/trpc'
import { createAction } from '~/lib/utils/helper-action/shared'

export const importFileAction = createAction(async (payload: { sessionId: number; file: File }) => {
  await api.sdbms.student.importFile(payload)
})

export const actionConnectStudent = createAction(async (payload: { srNo: string; dob: string }) => {
  await api.sdbms.student.connectProfile(payload)
  revalidatePath('/')
})

export const actionCreateTeacher = createAction(
  async (payload: {
    instituteId: number
    firstName: string
    lastName: string | null
    gender: number
  }) => {
    await api.sdbms.teacher.create(payload)
    revalidatePath('/')
  },
)
