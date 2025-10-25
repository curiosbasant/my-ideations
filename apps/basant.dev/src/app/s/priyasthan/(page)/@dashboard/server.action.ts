'use server'

import { revalidatePath } from 'next/cache'

import { api } from '~/lib/trpc'

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
    // return
    await api.user.workplace.create({ ...payload, text: 'My Location' })
  } else {
    await api.user.workplace.update({
      addressId: payload.addressId,
      latitude: payload.latitude,
      longitude: payload.longitude,
    })
  }
  revalidatePath('/')
}
