import { cache } from 'react'

import { dalDbOperation } from '~/lib/dal/helpers'
import { dalVerifySuccess } from '~/lib/dal/server'
import { api } from '~/lib/trpc'

export const getDocuments = cache(() => {
  return dalVerifySuccess(dalDbOperation(() => api.person.document.list()))
})

export const getDocumentTypes = cache(() => {
  return dalVerifySuccess(dalDbOperation(() => api.person.document.type.list()))
})
