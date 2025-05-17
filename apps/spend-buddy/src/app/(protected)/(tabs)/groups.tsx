import { Pressable, Text, View } from 'react-native'
import { Link } from 'expo-router'
import { FlashList, type ListRenderItemInfo } from '@shopify/flash-list'

import { useGroupList, type GroupListItem } from '~/features/group'
import { Image, Screen } from '~/ui'

export default function GroupsScreen() {
  const { isPending, isError, data: groups, isRefetching, refetch } = useGroupList()

  if (isError && !groups) {
    return <Screen.Crash onRetry={refetch} />
  }

  return (
    <Screen loading={isPending}>
      <FlashList
        contentContainerClassName='py-4'
        data={groups}
        renderItem={GroupListItem}
        ListEmptyComponent={EmptyListView}
        refreshing={isRefetching}
        onRefresh={refetch}
        estimatedItemSize={70}
      />
    </Screen>
  )
}

function GroupListItem(props: ListRenderItemInfo<GroupListItem>) {
  return (
    <Link
      href={`/groups/${props.item.id}?groupName=${props.item.name}`}
      asChild
      key={props.item.id}>
      <Pressable
        className='mb-1 gap-1 bg-secondary px-6 py-3'
        onLongPress={() => {
          console.log('group_id', props.item.id)
        }}>
        <Text className='color-foreground text-xl font-bold' numberOfLines={1}>
          {props.item.name}
        </Text>
        <Text className='color-muted-foreground'>
          Total Spends: ₹{props.item.totalSpends} • Members: {props.item.memberCount}
        </Text>
      </Pressable>
    </Link>
  )
}

function EmptyListView() {
  return (
    <View className='flex-1 items-center justify-center gap-8 p-16'>
      <Image className='size-40' source={require('~/assets/icons/empty_box.png')} />
      <Text className='color-secondary-foreground text-lg font-bold'>
        You have not joined any groups yet
      </Text>
    </View>
  )
}
