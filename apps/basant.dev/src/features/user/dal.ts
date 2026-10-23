import { dalTrpcQuery, dalVerifySuccess } from '~/lib/dal/server'
import { api } from '~/lib/trpc'

export const getProfileDetails = dalTrpcQuery(api.user.get, async (operation) => {
  const result = await operation
  if (result.success) return result.data || null
  if (result.error.type === 'unauthenticated') return null

  throw 'error' in result.error ? result.error.error : result.error
})

export const getDepartments = dalTrpcQuery(api.user.department.list, dalVerifySuccess)
