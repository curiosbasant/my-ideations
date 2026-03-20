import { cache } from 'react'
import { redirect } from 'next/navigation'

import { dalDbOperation, dalNullifyError } from '~/lib/dal/helpers'
import { dalVerifySuccess } from '~/lib/dal/server'
import { api } from '~/lib/trpc'

export const getPersonId = cache(() => dalNullifyError(dalDbOperation(() => api.person.id())))

export const ensurePersonId = cache(async () => {
  const result = await dalVerifySuccess(dalDbOperation(() => api.person.id()))
  if (!result) redirect('/')
  return result
})
