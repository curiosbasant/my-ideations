import { useState, type PropsWithChildren, type ReactElement } from 'react'
import {
  Modal,
  Pressable,
  Text,
  View,
  type GestureResponderEvent,
  type PressableProps,
  type ViewProps,
} from 'react-native'
import { Link } from 'expo-router'
import type { ExpoRouter } from 'expo-router/types/expo-router'

import { useToggle } from '@my/core/hooks'
import { cn } from '@my/lib/tw'

import { Icon, type IconName } from '~/ui'

export function PopupMenu(
  props: PropsWithChildren<{
    className?: string
    renderTrigger: (state: boolean, b: (ev: GestureResponderEvent) => void) => ReactElement
  }>,
) {
  const [show, toggleShow] = useToggle()
  const [paddingTop, setPaddingTop] = useState(0)

  const dismissModal = () => {
    toggleShow(false)
  }

  return (
    <>
      {props.renderTrigger(show, ({ nativeEvent: ev }) => {
        setPaddingTop(ev.pageY - ev.locationY + 32)
        toggleShow(true)
      })}
      <Modal visible={show} animationType='fade' statusBarTranslucent transparent>
        <Pressable className='flex-1' onPress={dismissModal}>
          <View
            className={cn('flex-1 items-end bg-secondary/25 p-2', props.className)}
            style={{ paddingTop }}
            pointerEvents='box-none'
            onTouchEnd={dismissModal}>
            {props.children}
          </View>
        </Pressable>
      </Modal>
    </>
  )
}

export function PopupMenuContent(props: ViewProps) {
  return (
    <View
      {...props}
      role='menu'
      className={cn('w-52 rounded-md border border-border bg-secondary shadow-lg', props.className)}
    />
  )
}
PopupMenu.Content = PopupMenuContent

export function PopupMenuItem(
  props: (PressableProps | { to?: ExpoRouter.Href }) & {
    icon?: IconName
    label: string
  },
) {
  const pressableJsx = (
    <Pressable
      {...props}
      role='menuitem'
      className='flex-row items-center gap-4 px-4 py-3 disabled:opacity-50'>
      {props.icon && <Icon name={props.icon} className='color-foreground opacity-75' size={18} />}
      <Text className='color-foreground flex-1 capitalize'>{props.label}</Text>
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
PopupMenu.Item = PopupMenuItem
