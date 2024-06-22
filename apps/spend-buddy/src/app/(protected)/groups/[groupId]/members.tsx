import { Text, View } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { FlashList, type ListRenderItemInfo } from '@shopify/flash-list'

import { formatDistanceToNow } from '@my/lib/date'

import { useGroup, useGroupMembers, type GroupMemberListItem } from '~/features/group'
import { UserAvatar } from '~/features/user'
import { Icon, Image, Screen } from '~/ui'

export default function GroupMembersScreen() {
  const params = useLocalSearchParams<{ groupId: string; groupName?: string }>()
  if (!params.groupId) throw new Error('Huh! Which group?')

  const { data: group } = useGroup(params.groupId)
  const { isPending, data: members, isRefetching, refetch } = useGroupMembers(params.groupId)

  return (
    <Screen className='p-0 px-4' loading={isPending}>
      <FlashList
        contentContainerClassName='py-4'
        data={members}
        extraData={group}
        ListEmptyComponent={EmptyListView}
        renderItem={MemberListItem}
        refreshing={isRefetching}
        onRefresh={refetch}
        keyExtractor={(item) => item.id}
        estimatedItemSize={190}
      />
    </Screen>
  )
}

function MemberListItem(props: ListRenderItemInfo<GroupMemberListItem>) {
  return (
    <View className='flex-row gap-4 rounded-lg px-4 py-2'>
      <View className='relative'>
        <UserAvatar url={props.item.avatarUrl} />
        {props.item.id === props.extraData.ownerId && (
          <Icon name='crown' className='color-primary absolute -right-1 bottom-0' size={12} />
        )}
      </View>
      <Text className='color-foreground font-bold'>{props.item.displayName}</Text>
      <Text className='color-muted-foreground text-xs'>
        joined {formatDistanceToNow(props.item.joinedAt)} ago
      </Text>
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
