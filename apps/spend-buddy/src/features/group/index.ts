import type { RouterOutputs } from '@my/api'

export * from './hooks'
export type GroupListItem = RouterOutputs['spendBuddy']['group']['all'][number]

export type GroupSpendListItem = RouterOutputs['spendBuddy']['group']['get']['spends'][number]
