import type { RouterOutputs } from '~/lib/trpc'

export * from './hooks'

export type NotificationListItem =
  RouterOutputs['spendBuddy']['notification']['all']['items'][number]
