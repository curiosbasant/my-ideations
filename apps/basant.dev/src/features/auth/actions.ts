'use server'

import { redirect } from 'next/navigation'

import { api } from '~/lib/trpc'

export async function actionSignOut() {
  await api.auth.signOut()
  redirect('/')
}
