import { Text, View } from 'react-native'
import { FlashList, type FlashListProps } from '@shopify/flash-list'

import { Image } from '~/ui'

export function ListView<T extends { id: any }>(props: FlashListProps<T>) {
  return (
    <FlashList
      {...props}
      inverted={props.inverted && !!props.data?.length}
      ListEmptyComponent={EmptyListView}
      keyExtractor={(item) => item.id}
    />
  )
}

export function EmptyListView() {
  return (
    <View className='items-center justify-center gap-8 px-16 py-32'>
      <Image className='size-40' source={require('~/assets/icons/empty_box.png')} />
      <Text className='text-lg font-bold color-muted-foreground'>There's nothing to see here!</Text>
    </View>
  )
}

export type { ListRenderItemInfo as ListItemProps } from '@shopify/flash-list'
