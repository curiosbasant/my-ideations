import type { ReactElement } from 'react'
import { Pressable, Text, View } from 'react-native'
import { Link } from 'expo-router'

import { formatDistance } from '@my/lib/date'

import { ListView, type ListItemProps } from '~/features/global'
import { useNotifications, type NotificationListItem } from '~/features/notification'
import { UserAvatar } from '~/features/user'
import { caller } from '~/lib/trpc'
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
      {isError && !notification ?
        <Screen.Crash onRetry={refetch} />
      : <ListView
          contentContainerClassName='py-3'
          data={notification?.pages.flatMap((p) => p.items)}
          getItemType={(item) => item.type}
          renderItem={ListItem}
          refreshing={isRefetching}
          onRefresh={refetch}
          onEndReached={fetchNextPage}
          estimatedItemSize={70}
        />
      }
    </Screen>
  )
}

const listItemTypes = {
  group_spend_add: (props) => (
    <Link href={`/groups/${props.item.group.id}?groupName=${props.item.group.name}`} asChild>
      <Pressable
        className={`flex-row items-center gap-4 border-b-2 ${props.item.read ? 'border-border' : 'border-primary/25 bg-primary/20'} p-3`}
        onPress={() => {
          caller.spendBuddy.notification.mark.mutate({ notificationId: props.item.id })
        }}>
        <UserAvatar url={props.item.user.avatarUrl} />
        <View className='flex-1'>
          <Text className='color-foreground'>
            <Text className='font-bold leading-6'>{props.item.user.displayName}</Text> has spent ₹
            {props.item.spend.amount} in the{' '}
            <Text className='font-bold leading-6'>{props.item.group.name}</Text> group.{' '}
            <Text className='text-sm color-muted-foreground'>
              {formatDistance(props.item.createdAt)}
            </Text>
          </Text>
        </View>
      </Pressable>
    </Link>
  ),
  group_member_add: (props) => (
    <Link href={`/groups/${props.item.group.id}/members`} asChild>
      <Pressable
        className={`flex-row items-center gap-4 border-b-2 ${props.item.read ? 'border-border' : 'border-primary/25 bg-primary/20'} p-3`}
        onPress={() => {
          caller.spendBuddy.notification.mark.mutate({ notificationId: props.item.id })
        }}>
        <UserAvatar url={props.item.member.avatarUrl} />
        <View className='flex-1'>
          <Text className='color-foreground'>
            A new member{' '}
            <Text className='font-bold leading-6'>{props.item.member.displayName}</Text> has been
            added to the <Text className='font-bold leading-6'>{props.item.group.name}</Text> group.{' '}
            <Text className='text-sm color-muted-foreground'>
              {formatDistance(props.item.createdAt)}
            </Text>
          </Text>
        </View>
      </Pressable>
    </Link>
  ),
} satisfies Record<string, (props: ListItemProps<NotificationListItem>) => ReactElement>

function ListItem(props: ListItemProps<NotificationListItem>) {
  return listItemTypes[props.item.type]?.(props)
}
