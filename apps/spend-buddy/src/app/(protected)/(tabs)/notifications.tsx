import type { ReactElement } from 'react'
import { Text, View } from 'react-native'

import { formatDistance } from '@my/lib/date'

import { ListView, type ListItemProps } from '~/features/global'
import { useNotifications, type NotificationListItem } from '~/features/notification'
import { UserAvatar } from '~/features/user'
import { Screen } from '~/ui'

export default function NotificationsScreen() {
  const {
    isPending,
    isError,
    data: notification,
    isRefetching,
    refetch,
    fetchNextPage,
  } = useNotifications()

  return (
    <Screen loading={isPending}>
      {isError && !notification ? (
        <Screen.Crash onRetry={refetch} />
      ) : (
        <ListView
          contentContainerClassName='py-3'
          data={notification?.pages.flatMap((p) => p.items)}
          getItemType={(item) => item.type}
          renderItem={ListItem}
          refreshing={isRefetching}
          onRefresh={refetch}
          onEndReached={fetchNextPage}
          estimatedItemSize={190}
        />
      )}
    </Screen>
  )
}

const listItemTypes = {
  group_spend_add: (props) => (
    <View className='mb-1 flex-row items-center gap-3 bg-primary/10 p-3'>
      <UserAvatar url={props.item.user.avatarUrl} />
      <View className='flex-1'>
        <Text className='color-foreground'>
          <Text className='font-bold leading-6'>{props.item.user.displayName}</Text> has spent ₹
          {props.item.spend.amount} in the{' '}
          <Text className='font-bold leading-6'>{props.item.group.name}</Text> group.{' '}
          <Text className='color-muted-foreground text-sm'>
            {formatDistance(props.item.createdAt)}
          </Text>
        </Text>
      </View>
    </View>
  ),
  group_member_add: (props) => (
    <View className='mb-1 flex-row items-center gap-3 bg-primary/10 p-3'>
      <UserAvatar url={props.item.member.avatarUrl} />
      <View className='flex-1'>
        <Text className='color-foreground'>
          A new member <Text className='font-bold leading-6'>{props.item.member.displayName}</Text>{' '}
          has been added to the <Text className='font-bold leading-6'>{props.item.group.name}</Text>{' '}
          group.{' '}
          <Text className='color-muted-foreground text-sm'>
            {formatDistance(props.item.createdAt)}
          </Text>
        </Text>
      </View>
    </View>
  ),
} satisfies Record<string, (props: ListItemProps<NotificationListItem>) => ReactElement>

function ListItem(props: ListItemProps<NotificationListItem>) {
  return listItemTypes[props.item.type]?.(props)
}
