import { useEffect, type PropsWithChildren } from 'react'
import { Keyboard, View } from 'react-native'
import { router, usePathname } from 'expo-router'

import { cn } from '~/lib/cva'

export type ScreenProps = {
  loading?: boolean
  className?: string
}

export function Screen(props: PropsWithChildren<ScreenProps>) {
  return (
    <View className={cn('flex-1 bg-background p-8', props.className)}>
      <LoadingScreenManager bool={props.loading} />
      {props.children}
    </View>
  )
}

export function LoadingScreenManager(props: { bool?: boolean }) {
  const pathname = usePathname()

  useEffect(() => {
    if (props.bool) {
      showLoadingScreen()
    } else if (pathname === '/loading') {
      hideLoadingScreen()
    }

    return () => {
      if (pathname === '/loading') {
        hideLoadingScreen()
      }
    }
  }, [props.bool])

  return null
}

export const showLoadingScreen = () => {
  Keyboard.dismiss()
  router.push('/loading')
}
export const hideLoadingScreen = () => router.canGoBack() && router.back()
