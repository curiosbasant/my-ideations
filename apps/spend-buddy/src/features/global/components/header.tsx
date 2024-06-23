import { Pressable } from 'react-native'
import { Link } from 'expo-router'
import type { ExpoRouter } from 'expo-router/types/expo-router'

import { Icon, type IconName } from '~/ui'

export function HeaderButton(props: { to: ExpoRouter.Href; icon: IconName; color?: string }) {
  return (
    <Link href={props.to} asChild>
      <Pressable className='items-center justify-center rounded-full p-1 px-2'>
        <Icon name={props.icon} color={props.color} size={20} />
      </Pressable>
    </Link>
  )
}
