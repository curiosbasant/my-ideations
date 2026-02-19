import { cache } from 'react'

import { dalDbOperation, dalVerifySuccess } from '~/lib/dal/helpers'
import { api } from '~/lib/trpc'

export const getDocuments = cache(() => {
  return dalVerifySuccess(dalDbOperation(() => api.person.document.list()))
})
