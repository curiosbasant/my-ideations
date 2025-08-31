'use server'

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
  return autocompletePlaces(payload.search)
})

export const saveUserLocation = async (payload: {
  placeId: string
  text: string
  secondaryText?: string | null
}) => {
  await api.user.address.update(payload)
  redirect('/') // revalidatePath isn't working
}
