import type { RouterOutputs } from '@my/api'

export * from './hooks'
export type GroupListItem = RouterOutputs['spendBuddy']['group']['all'][number]

export type GroupMemberListItem = RouterOutputs['spendBuddy']['group']['member']['all'][number]

export type GroupSpendListItem =
  RouterOutputs['spendBuddy']['group']['spend']['all']['items'][number]
