import { dalTrpcQuery, dalVerifySuccess } from '~/lib/dal/server'
import { api } from '~/lib/trpc'

export const getWorkplaces = dalTrpcQuery(api.priyasthan.workplace.list, dalVerifySuccess)
