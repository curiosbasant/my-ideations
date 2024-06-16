import { Toast } from '~/components/ui'
import { api as rootApi } from '~/lib/trpc'

const api = rootApi.spendBuddy.group

export function useGroupCreate() {
  const utils = rootApi.useUtils()
  return api.create.useMutation({
    onSuccess() {
      utils.spendBuddy.group.all.invalidate()
      Toast.show('Group is created!')
    },
  })
}

export function useGroupList() {
  return api.all.useQuery()
}
