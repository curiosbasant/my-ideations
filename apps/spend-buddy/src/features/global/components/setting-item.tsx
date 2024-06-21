import { Pressable, Text, type PressableProps } from 'react-native'
import { Link } from 'expo-router'
import { ExpoRouter } from 'expo-router/types/expo-router'
import { useColorScheme } from 'nativewind'

import { Icon, type IconName } from '../../../ui'

export function SettingItem(
  props: ({ disabled?: boolean; onPress?: () => void } | { to: ExpoRouter.Href }) & {
    iconName: IconName
    label: string
  },
) {
  const { colorScheme } = useColorScheme()
  const pressableProps: PressableProps = {
    className: 'flex-row items-center gap-4 px-8 py-4 disabled:opacity-50',
    android_ripple: {
      color: colorScheme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
    },
    children: (
      <>
        <Icon name={props.iconName} className='color-foreground w-6 opacity-75' size={16} />
        <Text className='color-foreground flex-1 text-lg capitalize'>{props.label}</Text>
        {'to' in props && (
          <Icon name='chevron-right' className='color-foreground w-6 opacity-75' size={14} />
        )}
      </>
    ),
  }

  return 'to' in props ? (
    <Link href={props.to} asChild>
      <Pressable {...pressableProps} />
    </Link>
  ) : (
    <Pressable {...pressableProps} {...props} />
  )
}
