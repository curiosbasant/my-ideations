import { Text, View } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { FlashList, type ListRenderItemInfo } from '@shopify/flash-list'

import { formatDistanceToNow } from '@my/lib/date'

import { useUser } from '~/features/auth'
import { HeaderButton, PopupMenu } from '~/features/global'
import { useGroupSpends, type GroupSpendListItem } from '~/features/group'
import { UserAvatar } from '~/features/user'
import { Icon, Image, Screen } from '~/ui'

export default function GroupViewScreen() {
  const params = useLocalSearchParams<{ groupId: string; groupName?: string }>()
  if (!params.groupId) throw new Error('Huh! Which group?')

  const user = useUser()
  const {
    isPending,
    isError,
    data: group,
    isRefetching,
    refetch,
    fetchNextPage,
  } = useGroupSpends(params.groupId)

  if (isError && !group) {
    return <Screen.Crash onRetry={refetch} />
  }

  return (
    <Screen
      loading={isPending}
      title={params.groupName}
      headerRight={(props) => (
        <View className='flex-row gap-3'>
          <HeaderButton
            to={`/groups/${params.groupId}/spend`}
            icon='plus'
            color={props.tintColor}
          />
          <PopupMenu
            renderTrigger={(_, showPopup) => (
              <HeaderButton icon='dots-vertical' color={props.tintColor} onPress={showPopup} />
            )}>
            <PopupMenu.Content>
              <PopupMenu.Item
                to={`/groups/${params.groupId}/members`}
                icon='account-group'
                label='Members'
              />
            </PopupMenu.Content>
          </PopupMenu>
        </View>
      )}>
      {group && (
        <FlashList
          contentContainerClassName='py-4'
          data={group.pages.flatMap((p) => p.items)}
          extraData={user.id}
          ListEmptyComponent={EmptyListView}
          renderItem={SpendListItem}
          inverted={!!group.pages[0].items.length}
          refreshing={isRefetching}
          onRefresh={refetch}
          onEndReached={fetchNextPage}
          estimatedItemSize={190}
          keyExtractor={(item) => item.id}
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
        className={`max-w-[50%] flex-1 gap-2 ${isMine ? 'bg-primary' : 'bg-secondary'} rounded-lg px-4 pb-3 pt-2`}>
        <Icon
          name='play'
          className={`absolute ${isMine ? '-right-2.5 color-primary' : '-left-2.5 color-secondary'} -top-[7] rotate-90`}
          size={20}
        />
        <Text className={`${textColor} font-bold`}>{props.item.user.displayName}</Text>
        <View className='mt-2 flex-row items-end justify-center'>
          <Text className={`${textColor} self-center text-3xl font-bold`}>₹</Text>
          <Text className={`${textColor} text-5xl font-bold`}>{props.item.amount}</Text>
        </View>
        <Text className={`${textColor} text-sm`}>{props.item.note}</Text>
      </View>
      <Text className='self-center text-xs color-muted-foreground'>
        {formatDistanceToNow(props.item.createdAt)} ago
      </Text>
    </View>
  )
}

function EmptyListView() {
  return (
    <View className='flex-1 items-center justify-center gap-8 p-16'>
      <Image
        className='size-40 color-foreground'
        source={require('~/assets/icons/wallet_empty.png')}
      />
      <Text className='text-lg font-bold color-secondary-foreground'>No Spendings Yet!</Text>
    </View>
  )
}
