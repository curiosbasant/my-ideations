import { Image, View } from 'react-native'

import { Icon } from '~/components/ui'

export function UserAvatar(props: { url?: string | null }) {
  return (
    <View
      className='size-8 items-center justify-center rounded-full bg-secondary'
      // weird enough, size-* was not working
      style={{ width: 32, height: 32 }}>
      {props.url ? (
        <Image
          className='size-8 rounded-full'
          style={{ width: 32, height: 32 }}
          src={props.url}
          resizeMode='contain'
        />
      ) : (
        <Icon name='user-alt' className='color-muted-foreground' />
      )}
    </View>
  )
}
