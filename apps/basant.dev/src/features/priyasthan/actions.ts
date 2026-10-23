'use server'

import { revalidatePath } from 'next/cache'

import { dalDbOperation } from '~/lib/dal/helpers'
import { dalLoginRedirect } from '~/lib/dal/server'
import { api } from '~/lib/trpc'

export const saveWorkplace = async (
  payload:
    | {
        latitude: number
        longitude: number
        type: `${'current' | 'preferred'}-workplace`
      }
    | {
        addressId: string
        latitude: number
        longitude: number
      },
) => {
  const operation = dalDbOperation((): Promise<any> => {
    if ('type' in payload) {
      return api.priyasthan.workplace.create({ ...payload, text: 'My Location' })
    }
    return api.priyasthan.workplace.update({
      addressId: payload.addressId,
      latitude: payload.latitude,
      longitude: payload.longitude,
    })
  })

  await dalLoginRedirect(operation)
  revalidatePath('/')
}
