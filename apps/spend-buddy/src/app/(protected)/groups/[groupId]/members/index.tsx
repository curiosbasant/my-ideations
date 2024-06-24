import { Text, View } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { FlashList, type ListRenderItemInfo } from '@shopify/flash-list'

import { formatDistanceToNow } from '@my/lib/date'

import { HeaderButton } from '~/features/global'
import { useGroupList, useGroupMembers, type GroupMemberListItem } from '~/features/group'
import { UserAvatar } from '~/features/user'
import { Icon, Image, Screen } from '~/ui'

export default function GroupMembersScreen() {
  const params = useLocalSearchParams<{ groupId: string; groupName?: string }>()
  if (!params.groupId) throw new Error('Huh! Which group?')

  const { data: groups } = useGroupList()
  const {
    isPending,
    isError,
    data: members,
    isRefetching,
    refetch,
  } = useGroupMembers(params.groupId)

  if (isError && !members) {
    return <Screen.Crash onRetry={refetch} />
  }

  const currentGroupOwnerId = groups?.find((g) => g.id === params.groupId)?.ownerId

  return (
    <Screen
      className='px-4'
      loading={isPending}
      headerRight={(props) => (
        <View className='flex-row gap-2'>
          <HeaderButton
            to={`/groups/${params.groupId}/members/invite`}
            icon='plus'
            color={props.tintColor}
          />
        </View>
      )}>
      <FlashList
        contentContainerClassName='py-4'
        data={members}
        extraData={currentGroupOwnerId}
        ListEmptyComponent={EmptyListView}
        renderItem={MemberListItem}
        refreshing={isRefetching}
        onRefresh={refetch}
        keyExtractor={(item) => item.id}
        estimatedItemSize={50}
      />
    </Screen>
  )
}

function MemberListItem(props: ListRenderItemInfo<GroupMemberListItem>) {
  return (
    <View className='flex-row items-center gap-4 rounded-lg px-4 py-2'>
      <View className='relative'>
        <UserAvatar url={props.item.avatarUrl} />
        {props.item.id === props.extraData && (
          <Icon name='crown' className='color-primary absolute -right-1 bottom-0' size={12} />
        )}
      </View>
      <View className='flex-1'>
        <Text className='color-foreground font-bold'>{props.item.displayName}</Text>
        <Text className='color-muted-foreground text-xs'>
          joined {formatDistanceToNow(props.item.joinedAt)} ago
        </Text>
      </View>
      <Text className='color-foreground text-xl font-bold'>₹{props.item.spends}</Text>
    </View>
  )
}

function EmptyListView() {
  return (
    <View className='flex-1 items-center justify-center gap-8 p-16'>
      <Image className='size-40' source={require('~/assets/icons/empty_box.png')} />
      <Text className='color-secondary-foreground text-lg font-bold'>No members in this group</Text>
    </View>
  )
}
