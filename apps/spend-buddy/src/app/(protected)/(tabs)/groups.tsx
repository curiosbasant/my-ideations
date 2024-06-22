import { Pressable, Text, View } from 'react-native'
import { Link } from 'expo-router'
import { FlashList, type ListRenderItemInfo } from '@shopify/flash-list'

import { useGroupList, type GroupListItem } from '~/features/group'
import { Image, Screen } from '~/ui'

export default function GroupsScreen() {
  return (
    <Screen className='p-0'>
      <GroupList />
    </Screen>
  )
}

function GroupList() {
  const { data, isLoading, isRefetching, refetch } = useGroupList()

  if (data) {
    return (
      <FlashList
        contentContainerClassName='py-5'
        data={data}
        renderItem={GroupListItem}
        ListEmptyComponent={EmptyListView}
        refreshing={isRefetching}
        onRefresh={refetch}
        estimatedItemSize={70}
      />
    )
  }

  if (isLoading) return <Text className='color-foreground mt-8 text-center'>Loading...</Text>
  return <Screen.Crash onRetry={() => refetch()} />
}

function GroupListItem(props: ListRenderItemInfo<GroupListItem>) {
  return (
    <Link
      href={`/groups/${props.item.id}?groupName=${props.item.name}`}
      asChild
      key={props.item.id}>
      <Pressable className='mb-1 gap-2 bg-secondary px-6 py-3'>
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
