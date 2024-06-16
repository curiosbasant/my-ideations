import { Image, View } from 'react-native'

import { Icon } from '~/components/ui'

export function UserAvatar(props: { url?: string | null }) {
  return (
    <View className='size-8 items-center justify-center rounded-full bg-secondary'>
      {props.url ? (
        <Image className='size-8 rounded-full' src={props.url} resizeMode='cover' />
      ) : (
        <Icon name='user-alt' className='color-muted-foreground' />
      )}
    </View>
  )
}
