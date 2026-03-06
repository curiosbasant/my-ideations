import { dalTrpcQuery, dalVerifySuccess } from '~/lib/dal/helpers'
import { api } from '~/lib/trpc'

export const getPublicUrlFromShortcode = dalTrpcQuery(api.snapfile.publicUrl, dalVerifySuccess)

export const getRecentFormats = dalTrpcQuery(api.snapfile.format.list, dalVerifySuccess)
