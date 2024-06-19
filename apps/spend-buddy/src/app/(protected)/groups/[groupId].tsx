import { Text, View } from 'react-native'
import { Stack, useLocalSearchParams } from 'expo-router'
import { FlashList, type ListRenderItemInfo } from '@shopify/flash-list'

import { formatDistanceToNow } from '@my/lib/date'

import { Image, Screen } from '~/components/ui'
import { useUser } from '~/features/auth'
import { useGroup, type GroupSpendListItem } from '~/features/group'
import { UserAvatar } from '~/features/user'

export default function GroupViewScreen() {
  const params = useLocalSearchParams<{ groupId: string; groupName?: string }>()
  if (!params.groupId) throw new Error('Huh! Which group?')

  const user = useUser()
  const { isPending, data: group, isRefetching, refetch } = useGroup(params.groupId)

  if (group) {
    return (
      <Screen className='p-0'>
        <Stack.Screen options={{ title: group.name }} />
        <FlashList
          data={group.spends}
          extraData={user.id}
          ListEmptyComponent={EmptyListView}
          renderItem={SpendListItem}
          inverted={!!group.spends.length}
          refreshing={isRefetching}
          onRefresh={refetch}
          keyExtractor={(item) => item.id}
          estimatedItemSize={190}
        />
      </Screen>
    )
  }

  if (isPending) {
    return (
      <>
        {!params.groupName || <Stack.Screen options={{ title: params.groupName }} />}
        <Screen.Loading />
      </>
    )
  }

  return <Screen.Crash />
}

function SpendListItem(props: ListRenderItemInfo<GroupSpendListItem>) {
  const isMine = props.item.user.id === props.extraData
  return (
    <View className={`gap-4 p-4 ${isMine ? 'flex-row-reverse self-end' : 'flex-row self-start'}`}>
      <UserAvatar url={props.item.user.avatarUrl} />
      <View
        className={`max-w-[50%] flex-1 gap-2 ${isMine ? 'bg-primary/75' : 'bg-secondary'} rounded-lg px-4 pb-3 pt-2.5`}>
        <Text className='color-foreground text-sm'>{props.item.user.displayName}</Text>
        <View className='mt-2 flex-row items-end justify-center'>
          <Text className='color-foreground self-center text-3xl font-bold'>₹</Text>
          <Text className='color-foreground text-5xl font-bold'>{props.item.amount}</Text>
        </View>
        <Text className='color-secondary-foreground text-sm'>{props.item.note}</Text>
      </View>
      <Text className='color-muted-foreground self-center text-xs'>
        {formatDistanceToNow(props.item.createdAt)} ago
      </Text>
    </View>
  )
}

function EmptyListView() {
  return (
    <View className='flex-1 items-center justify-center gap-8 p-16'>
      <Image
        className='color-foreground size-40'
        source={require('~/assets/icons/wallet_empty.png')}
      />
      <Text className='color-secondary-foreground text-lg font-bold'>No Spendings Yet!</Text>
    </View>
  )
}

