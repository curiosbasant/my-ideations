import { useEffect, type PropsWithChildren } from 'react'
import { Keyboard, ScrollView, Text, View } from 'react-native'
import { router, usePathname } from 'expo-router'

import { cn } from '~/lib/cva'
import { Spinner } from './spinner'

export type ScreenProps = {
  className?: string
  loading?: boolean
  scrollable?: boolean
}

export function Screen(props: PropsWithChildren<ScreenProps>) {
  const Container = props.scrollable ? ScrollView : View
  return (
    <Container className={cn('flex-1 bg-background p-8', props.className)}>
      <LoadingScreenManager bool={props.loading} />
      {props.children}
    </Container>
  )
}
Screen.displayName = 'ui/Screen'

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

export function LoadingScreen() {
  return (
    <View className='flex-1 items-center justify-center gap-4 bg-background/85'>
      <Spinner className='color-primary' size={64} />
      <Text className='color-foreground text-lg font-bold'>Please wait...</Text>
    </View>
  )
}
Screen.Loading = LoadingScreen
