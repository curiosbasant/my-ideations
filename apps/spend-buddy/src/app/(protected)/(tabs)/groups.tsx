import { Pressable, Text, View } from 'react-native'
import { Link } from 'expo-router'
import { FlashList, type ListRenderItemInfo } from '@shopify/flash-list'

import { Screen } from '~/components/ui'
import { useGroupList, type GroupListItem } from '~/features/group'

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
    return data.length === 0 ? (
      <View></View>
    ) : (
      <FlashList
        data={data}
        renderItem={GroupListItem}
        refreshing={isRefetching}
        onRefresh={refetch}
        estimatedItemSize={70}
      />
    )
  }

  if (isLoading) return <Text className='color-foreground mt-8 text-center'>Loading...</Text>
  return <Screen.Crash />
}

function GroupListItem(props: ListRenderItemInfo<GroupListItem>) {
  return (
    <Link
      href={`/groups/${props.item.id}?groupName=${props.item.name}`}
      asChild
      key={props.item.id}>
      <Pressable className='mb-1 gap-2 bg-secondary px-6 py-2'>
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
