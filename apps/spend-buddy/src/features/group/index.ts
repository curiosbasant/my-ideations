import type { RouterOutputs } from '@my/api'

export * from './hooks'
export type GroupListItem = RouterOutputs['spendBuddy']['group']['all'][number]
