import { router } from 'expo-router'

import { Toast } from '~/components/ui'
import { api as rootApi } from '~/lib/trpc'

const api = rootApi.spendBuddy.group

export function useGroupCreate() {
  const utils = rootApi.useUtils()
  return api.create.useMutation({
    onSuccess(data) {
      utils.spendBuddy.group.all.invalidate()
      router.replace(`/groups/${data.id}?groupName=${data.name}`)
      Toast.show('Group is created!')
    },
  })
}

export function useGroupList() {
  return api.all.useQuery()
}

export function useGroup(groupId: string) {
  return api.get.useQuery(groupId)
}
