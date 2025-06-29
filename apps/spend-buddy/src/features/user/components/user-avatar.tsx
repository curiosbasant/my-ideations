import { Image, View } from 'react-native'

import { Icon } from '~/ui'

export function UserAvatar(props: { url?: string | null }) {
  return (
    <View className='size-10 items-center justify-center rounded-full border border-border bg-secondary'>
      {props.url ?
        <Image className='size-10 rounded-full' src={props.url} resizeMode='contain' />
      : <Icon name='account' className='opacity-75 color-muted-foreground' size={22} />}
    </View>
  )
}
