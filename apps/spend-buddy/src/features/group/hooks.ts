import { router } from 'expo-router'

import { api as rootApi } from '~/lib/trpc'
import { Toast } from '~/ui'

const api = rootApi.spendBuddy.group

export function useGroupCreate() {
  const utils = rootApi.useUtils()
  return api.create.useMutation({
    onSuccess(data) {
      utils.spendBuddy.group.all.invalidate()
      router.dismissAll()
      router.navigate(`/groups/${data.id}?groupName=${data.name}`)
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

export function useGroupMembers(groupId: string) {
  return api.member.all.useQuery(groupId)
}

export function useGroupMemberInvite() {
  const utils = rootApi.useUtils()
  return api.member.invite.useMutation({
    async onSuccess(_, input) {
      utils.spendBuddy.group.member.all.invalidate()
      Toast.show('Member added to the group!')
      router.navigate(`/groups/${input.groupId}/members`)
    },
  })
}

export function useGroupSpendAdd() {
  const utils = rootApi.useUtils()
  return api.spend.create.useMutation({
    async onSuccess(_, input) {
      utils.spendBuddy.group.get.invalidate()
      Toast.show('Spend added to the group!')
      router.navigate(`/groups/${input.groupId}`)
    },
  })
}
