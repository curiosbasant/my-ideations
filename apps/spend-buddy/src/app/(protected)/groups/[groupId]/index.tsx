import { Text, View } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { FlashList, type ListRenderItemInfo } from '@shopify/flash-list'

import { formatDistanceToNow } from '@my/lib/date'

import { useUser } from '~/features/auth'
import { HeaderButton } from '~/features/global'
import { useGroup, type GroupSpendListItem } from '~/features/group'
import { UserAvatar } from '~/features/user'
import { Icon, Image, Screen } from '~/ui'

export default function GroupViewScreen() {
  const params = useLocalSearchParams<{ groupId: string; groupName?: string }>()
  if (!params.groupId) throw new Error('Huh! Which group?')

  const user = useUser()
  const { isPending, isError, data: group, isRefetching, refetch } = useGroup(params.groupId)

  if (isError && !group) {
    return <Screen.Crash onRetry={refetch} />
  }

  return (
    <Screen
      loading={isPending}
      title={group?.name || params.groupName}
      headerRight={(props) => (
        <View className='flex-row gap-2'>
          <HeaderButton
            to={`/groups/${params.groupId}/spend`}
            icon='plus'
            color={props.tintColor}
          />
          <HeaderButton
            to={`/groups/${params.groupId}/members`}
            icon='users'
            color={props.tintColor}
          />
        </View>
      )}>
      {group && (
        <FlashList
          contentContainerClassName='py-4'
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
      )}
    </Screen>
  )
}

function SpendListItem(props: ListRenderItemInfo<GroupSpendListItem>) {
  const isMine = props.item.user.id === props.extraData
  const textColor = isMine ? 'color-primary-foreground' : 'color-foreground'
  return (
    <View
      className={`gap-4 p-4 ${isMine ? 'flex-row-reverse self-end' : 'flex-row self-start'} items-start`}>
      <UserAvatar url={props.item.user.avatarUrl} />
      <View
        className={`relative max-w-[50%] flex-1 gap-2 ${isMine ? 'bg-primary' : 'bg-secondary'} rounded-lg px-4 pb-3 pt-2`}>
        <Icon
          name='play'
          className={`absolute ${isMine ? 'color-primary -right-2' : 'color-secondary -left-2'} -top-0.5 rotate-90`}
          size={18}
        />
        <Text className={`${textColor} font-bold`}>{props.item.user.displayName}</Text>
        <View className='mt-2 flex-row items-end justify-center'>
          <Text className={`${textColor} self-center text-3xl font-bold`}>₹</Text>
          <Text className={`${textColor} text-5xl font-bold`}>{props.item.amount}</Text>
        </View>
        <Text className={`${textColor} text-sm`}>{props.item.note}</Text>
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
