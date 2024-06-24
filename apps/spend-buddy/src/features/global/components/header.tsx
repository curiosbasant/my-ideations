import { Pressable, type PressableProps } from 'react-native'
import { Link } from 'expo-router'
import type { ExpoRouter } from 'expo-router/types/expo-router'

import { Icon, type IconName } from '~/ui'

export function HeaderButton(
  props: (PressableProps | { to?: ExpoRouter.Href }) & {
    icon: IconName
    color?: string
  },
) {
  const pressableJsx = (
    <Pressable
      {...props}
      className='items-center justify-center rounded-full'
      style={{ width: 30, height: 30 }}>
      <Icon name={props.icon} color={props.color} size={20} />
    </Pressable>
  )

  return 'to' in props && props.to ? (
    <Link href={props.to} asChild>
      {pressableJsx}
    </Link>
  ) : (
    pressableJsx
  )
}
