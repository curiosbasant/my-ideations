import { cache } from 'react'
import { redirect } from 'next/navigation'

import { dalDbOperation, dalNullifyError, dalVerifySuccess } from '~/lib/dal/helpers'
import { api } from '~/lib/trpc'

export const getPersonId = cache(() => dalNullifyError(dalDbOperation(() => api.person.id())))

export const ensurePersonId = cache(async () => {
  const result = await dalVerifySuccess(dalDbOperation(() => api.person.id()))
  if (!result) redirect('/')
  return result
})
