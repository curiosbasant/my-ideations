import { cache } from 'react'

import { dalDbOperation, dalVerifySuccess } from '~/lib/dal/helpers'
import { api } from '~/lib/trpc'

export const checkIfAdmin = cache(async () => {
  return dalVerifySuccess(await dalDbOperation(() => api.sdbms.admin.check()))
})

export const getExams = cache(() => {
  return api.sdbms.exam.list()
})

export const getSessions = cache(() => {
  return api.sdbms.session.list()
})

export const getSubjects = cache(() => {
  return api.sdbms.subject.list()
})

export const getTeacherSubjects = cache((sessionId: number) => {
  return api.sdbms.teacher.subject.list({ sessionId })
})

export const getInstitutes = cache(() => {
  return api.sdbms.institute.list()
})

export const getInstituteClasses = cache(() => {
  return api.sdbms.class.list()
})

export const getClassStudentsMark = cache(
  (sessionId: number, exam: number, standard: number, subject: number) => {
    return api.sdbms.class.student.mark.list({ sessionId, exam, standard, subject })
  },
)

export const getUserRole = cache(async () => {
  return dalVerifySuccess(await dalDbOperation(() => api.sdbms.user.role()))
})
