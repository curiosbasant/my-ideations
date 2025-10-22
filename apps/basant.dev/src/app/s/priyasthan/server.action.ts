'use server'

import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { autocompletePlaces } from '@my/lib/maps'

import { actionWrapper } from '~/app/shared'
import { getSupabase } from '~/lib/supabase'
import { api } from '~/lib/trpc'

export const signInWithProviderAction = actionWrapper(async (payload: { redirectTo?: string }) => {
  const [supabase, heads] = await Promise.all([getSupabase(), headers()])
  const origin = heads.get('origin')
  if (!origin) throw new Error('No origin header found')

  const redirectUrl = new URL('/auth/callback', origin)
  payload.redirectTo && redirectUrl.searchParams.set('next', payload.redirectTo)

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUrl.toString(),
    },
  })
  if (error) throw error

  redirect(data.url)
})

export const autocompletePlacesAction = actionWrapper(async (payload: { search: string }) => {
  return [
    {
      placeId: 'ChIJibsL2XvdPzkRa4FkdhoS40w',
      text: 'Bikaner, Rajasthan, India',
      mainText: 'Bikaner',
      secondaryText: 'Rajasthan, India',
    },
    {
      placeId: 'ChIJBdvdhFbnPzkRpzN7foDWSfg',
      text: 'Bikaner Railway Station, Railway Station Link Road, Rani Bazar, Bikaner, Rajasthan, India',
      mainText: 'Bikaner Railway Station',
      secondaryText: 'Railway Station Link Road, Rani Bazar, Bikaner, Rajasthan, India',
    },
    {
      placeId: 'ChIJad1vlHLjDDkRtt7_x7ZV4ss',
      text: 'Bikaner House, Shahjahan Road, Pandara Flats, India Gate, New Delhi, Delhi, India',
      mainText: 'Bikaner House',
      secondaryText: 'Shahjahan Road, Pandara Flats, India Gate, New Delhi, Delhi, India',
    },
    {
      placeId: 'ChIJByrppRFbDTkRBWs59HQYfUQ',
      text: 'Bikaner, Haryana, India',
      mainText: 'Bikaner',
      secondaryText: 'Haryana, India',
    },
    {
      placeId: 'ChIJlw3tcFHBj4AR4Kb9-cgnxY0',
      text: 'Bikanervala Fremont, Mowry Avenue, Fremont, CA, USA',
      mainText: 'Bikanervala Fremont',
      secondaryText: 'Mowry Avenue, Fremont, CA, USA',
    },
  ]
  return autocompletePlaces(payload.search)
})

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

export const saveCurrentWorkplace = actionWrapper(
  async (payload: { placeId: string; text: string; secondaryText?: string | null }) => {
    await api.user.address.upsert(payload)
    revalidatePath('/')
  },
)

export const savePreferredWorkplace = actionWrapper(
  async (payload: { placeId: string; text: string; secondaryText?: string | null }) => {
    await api.priyasthan.workplace.savePreferred(payload)
    revalidatePath('/')
  },
)

export const saveDesignation = async (payload: { departmentId: string; designation: string }) => {
  await api.user.department.update({
    departmentId: Number(payload.departmentId),
    designation: payload.designation,
  })
  revalidatePath('/')
}

export const getDepartmentDesignations = actionWrapper(
  async (payload: { departmentId: number }) => {
    return api.user.department.designation.list({ departmentId: payload.departmentId })
  },
)
