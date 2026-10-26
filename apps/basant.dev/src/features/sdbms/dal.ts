import { dalTrpcQuery, dalVerifySuccess } from '~/lib/dal/server'
import { api } from '~/lib/trpc'

export const getExams = dalTrpcQuery(api.sdbms.exam.list, dalVerifySuccess)

export const getSessions = dalTrpcQuery(api.sdbms.session.list, dalVerifySuccess)

export const getSubjects = dalTrpcQuery(api.sdbms.subject.list, dalVerifySuccess)

export const getTeacherSubjects = dalTrpcQuery(api.sdbms.teacher.subject.list, dalVerifySuccess)

export const getInstitutes = dalTrpcQuery(api.sdbms.institute.list, dalVerifySuccess)

export const getInstituteClasses = dalTrpcQuery(api.sdbms.class.list, dalVerifySuccess)

export const getClassStudentsMark = dalTrpcQuery(
  api.sdbms.class.student.mark.list,
  dalVerifySuccess,
)

export const getUserRole = dalTrpcQuery(api.sdbms.user.role, dalVerifySuccess)
