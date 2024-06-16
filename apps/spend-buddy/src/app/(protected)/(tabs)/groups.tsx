import { FlatList, Pressable, Text, View, type ListRenderItemInfo } from 'react-native'

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
  const { data, isLoading } = useGroupList()

  if (data) {
    return data.length === 0 ? (
      <View></View>
    ) : (
      <FlatList className='' data={data} renderItem={GroupListItem} />
    )
  }

  if (isLoading) return <Text className='color-foreground mt-8 text-center'>Loading...</Text>
  return <Text className='color-foreground text-center'>Something went wrong</Text>
}

function GroupListItem(props: ListRenderItemInfo<GroupListItem>) {
  return (
    <Pressable className='mb-1 gap-2 bg-secondary px-6 py-2' key={props.item.id}>
      <Text className='color-foreground text-xl font-bold' numberOfLines={1}>
        {props.item.name}
      </Text>
      <Text className='color-muted-foreground'>
        Total Spends: ₹{props.item.totalSpends} • Members: {props.item.memberCount}
      </Text>
    </Pressable>
  )
}
