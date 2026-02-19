'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { getSupabase } from '~/lib/supabase'
import { createAction } from '~/lib/utils/helper-action/shared'

export const signInWithProviderAction = createAction(
  async (payload: { continue?: string | true }) => {
    const [supabase, heads] = await Promise.all([getSupabase(), headers()])
    const origin = heads.get('origin')
    if (!origin) throw new Error('No origin header found')

    const redirectUrl = new URL('/auth/callback', origin)

    if (payload.continue === true) {
      const referrer = heads.get('referer')
      const continuePathname = referrer && URL.parse(referrer)?.searchParams.get('continue')
      continuePathname && redirectUrl.searchParams.set('next', continuePathname)
    } else if (payload.continue) {
      redirectUrl.searchParams.set('next', payload.continue)
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl.toString(),
      },
    })
    if (error) throw error

    redirect(data.url)
  },
)
