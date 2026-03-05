'use server'

import { revalidatePath } from 'next/cache'

import { dalLoginRedirect, dalTrpcAction } from '~/lib/dal/helpers'
import { api } from '~/lib/trpc'

export const actionStudentImportFile = dalTrpcAction(api.sdbms.student.importFile, dalLoginRedirect)

export const actionTeacherImportFile = dalTrpcAction(api.sdbms.teacher.importFile, dalLoginRedirect)

export const actionTeacherToggleSubject = dalTrpcAction(
  api.sdbms.teacher.subject.toggle,
  async (operation) => {
    const result = await dalLoginRedirect(operation)
    revalidatePath('/subjects')
    return result
  },
)

export const actionConnectStudent = dalTrpcAction(
  api.sdbms.student.connectProfile,
  async (operation) => {
    const result = await dalLoginRedirect(operation)
    revalidatePath('/')
    return result
  },
)

export const actionConnectTeacher = dalTrpcAction(
  api.sdbms.teacher.connectProfile,
  async (operation) => {
    const result = await dalLoginRedirect(operation)
    revalidatePath('/')
    return result
  },
)

export const actionSetStudentClassMark = dalTrpcAction(
  api.sdbms.class.student.mark.set,
  dalLoginRedirect,
)
