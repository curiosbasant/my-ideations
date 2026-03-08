import { dalTrpcQuery, dalVerifySuccess } from '~/lib/dal/helpers'
import { api } from '~/lib/trpc'

export const getPublicUrlFromShortcode = dalTrpcQuery(api.snapfile.publicUrl, dalVerifySuccess)

export const getRoom = dalTrpcQuery(api.snapfile.room.get, dalVerifySuccess)
export const getRoomFiles = dalTrpcQuery(api.snapfile.room.file.list, dalVerifySuccess)
export const getRecentFormats = dalTrpcQuery(api.snapfile.format.list, dalVerifySuccess)
