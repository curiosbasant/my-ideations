import { api as rootApi } from '~/lib/trpc'

const api = rootApi.spendBuddy.group

export function useGroupList() {
  return api.all.useQuery()
}
