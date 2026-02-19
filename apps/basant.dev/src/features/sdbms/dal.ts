import { cache } from 'react'

import { dalDbOperation, dalVerifySuccess } from '~/lib/dal/helpers'
import { api } from '~/lib/trpc'

export const checkIfAdmin = cache(() => {
  return dalVerifySuccess(dalDbOperation(() => api.sdbms.admin.check()))
})

export const getExams = cache(() => {
  return api.sdbms.exam.list()
})

export const getSessions = cache(() => {
  return api.sdbms.session.list()
})

export const getSubjects = cache(() => {
  return dalVerifySuccess(dalDbOperation(() => api.sdbms.subject.list()))
})

export const getTeacherSubjects = cache((sessionId: number) => {
  return dalVerifySuccess(dalDbOperation(() => api.sdbms.teacher.subject.list({ sessionId })))
})

export const getInstitutes = cache(() => {
  return api.sdbms.institute.list()
})

export const getInstituteClasses = cache(() => {
  return dalVerifySuccess(dalDbOperation(() => api.sdbms.class.list()))
})

export const getClassStudentsMark = cache(
  (sessionId: number, exam: number, standard: number, subject: number) => {
    return dalVerifySuccess(
      dalDbOperation(() =>
        api.sdbms.class.student.mark.list({ sessionId, exam, standard, subject }),
      ),
    )
  },
)

export const getUserRole = cache(() => {
  return dalVerifySuccess(dalDbOperation(() => api.sdbms.user.role()))
})
