'use server'

import { redirect } from 'next/navigation'

import { api } from '~/lib/trpc'
import { SIGN_IN_PATH } from '../shared/constants'

export async function actionSignOut() {
  await api.auth.signOut()
  redirect(SIGN_IN_PATH)
}
