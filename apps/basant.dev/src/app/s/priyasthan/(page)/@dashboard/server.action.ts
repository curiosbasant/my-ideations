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

export const saveWorkplace = async (
  payload:
    | {
        latitude: number
        longitude: number
        type: `${'current' | 'preferred'}-workplace`
      }
    | {
        addressId: number
        latitude: number
        longitude: number
      },
) => {
  if ('type' in payload) {
    await api.priyasthan.workplace.create({ ...payload, text: 'My Location' })
  } else {
    await api.priyasthan.workplace.update({
      addressId: payload.addressId,
      latitude: payload.latitude,
      longitude: payload.longitude,
    })
  }
  revalidatePath('/')
}
