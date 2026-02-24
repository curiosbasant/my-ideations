import { cache } from 'react'
import { redirect } from 'next/navigation'

import { dalDbOperation, dalVerifySuccess } from '~/lib/dal/helpers'
import { api } from '~/lib/trpc'

export const ensurePersonId = cache(async () => {
  const result = await dalVerifySuccess(dalDbOperation(() => api.person.id()))
  if (!result) redirect('/')
  return result
})
