import { cache } from 'react'

import { api } from '~/lib/trpc'

export const getExams = cache(() => {
  return api.sdbms.exam.list()
})

export const getSessions = cache(() => {
  return api.sdbms.session.list()
})

export const getSubjects = cache(() => {
  return api.sdbms.subject.list()
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
