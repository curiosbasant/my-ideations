import { useEffect, type PropsWithChildren } from 'react'
import { Keyboard, ScrollView, Text, View } from 'react-native'
import { Image } from 'expo-image'
import { router, usePathname } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

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
      <StatusBar style='light' animated translucent />
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

export function CrashScreen(props: Partial<{ title: string | null; message: string | null }>) {
  return (
    <View className='items-center gap-2 p-16'>
      <Image
        source={require('~/assets/icons/snap_error.png')}
        contentFit='contain'
        style={{ height: 150, width: '100%' }}
      />
      {props.title === null || (
        <Text className='color-foreground mt-8 text-center text-3xl font-bold'>
          {props.title || 'Oops!'}
        </Text>
      )}
      {props.message === null || (
        <Text className='color-foreground text-center'>
          {props.message || 'Something went wrong'}
        </Text>
      )}
    </View>
  )
}
Screen.Crash = CrashScreen
