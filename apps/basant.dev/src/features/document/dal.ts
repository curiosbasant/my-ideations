import { dalTrpcQuery, dalVerifySuccess } from '~/lib/dal/server'
import { api } from '~/lib/trpc'

export const getDocuments = dalTrpcQuery(api.person.document.list, dalVerifySuccess)

export const getDocumentTypes = dalTrpcQuery(api.person.document.type.list, dalVerifySuccess)
