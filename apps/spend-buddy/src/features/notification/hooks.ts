import { api as rootApi } from '~/lib/trpc'

const api = rootApi.spendBuddy.notification

export function useNotifications() {
  return api.all.useInfiniteQuery(
    {},
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  )
}

export function useNotificationsUnreadCount() {
  return api.unread.useQuery()
}
