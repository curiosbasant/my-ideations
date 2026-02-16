'use server'

import { revalidatePath } from 'next/cache'

import { api } from '~/lib/trpc'
import { createAction } from '~/lib/utils/helper-action/shared'

export const actionStudentImportFile = createAction(
  async (payload: { sessionId: number; file: File }) => {
    await api.sdbms.student.importFile(payload)
  },
)

export const actionTeacherImportFile = createAction(
  async (payload: { instituteId: number; file: File }) => {
    await api.sdbms.teacher.importFile(payload)
  },
)

export async function actionTeacherToggleSubject(payload: {
  sessionId: number
  sectionId: number
  subjectId: number
}) {
  await api.sdbms.teacher.subject.toggle(payload)
  revalidatePath('/subjects')
}

export const actionConnectStudent = createAction(async (payload: { srNo: string; dob: string }) => {
  await api.sdbms.student.connectProfile(payload)
  revalidatePath('/')
})

export const actionConnectTeacher = createAction(
  async (payload: { employeeId: string; dob: string }) => {
    await api.sdbms.teacher.connectProfile(payload)
    revalidatePath('/')
  },
)

export const actionSetStudentClassMark = createAction(
  async (payload: { exam: number; classStudentId: number; subject: number; mark: number }) => {
    await api.sdbms.class.student.mark.set(payload)
  },
)
