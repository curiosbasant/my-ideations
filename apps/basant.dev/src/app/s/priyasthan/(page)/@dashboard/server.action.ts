'use server'

import { revalidatePath } from 'next/cache'

import { actionWrapper } from '~/app/shared'
import { api } from '~/lib/trpc'

export const getDepartmentDesignations = actionWrapper(
  async (payload: { departmentId: number }) => {
    return api.user.department.designation.list({ departmentId: payload.departmentId })
  },
)

export const saveDesignation = async (payload: { departmentId: string; designation: string }) => {
  await api.user.department.update({
    departmentId: Number(payload.departmentId),
    designation: payload.designation,
  })
  revalidatePath('/')
}
