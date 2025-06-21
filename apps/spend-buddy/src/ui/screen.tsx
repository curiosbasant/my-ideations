import type { PropsWithChildren } from 'react'
import { Modal, ScrollView, Text, View } from 'react-native'
import { Image } from 'expo-image'
import { StatusBar } from 'expo-status-bar'
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack'

import { cn } from '@my/lib/tw'

import { Button } from './button'
import { Stack } from './native'
import { Spinner } from './spinner'

export type ScreenProps = NativeStackNavigationOptions & {
  className?: string
  /** Shows a loading state, when the screen is not full ready to display content */
  loading?: boolean
  /** Shows a loading state, on top of the current screen, on some user action */
  waiting?: boolean
  /** Makes the screen scrollable */
  scrollable?: boolean
}

export function Screen({
  className,
  loading,
  waiting,
  scrollable,
  children,
  ...screenOptions
}: PropsWithChildren<ScreenProps>) {
  const Container = scrollable ? ScrollView : View
  return (
    <Container className={cn('flex-1 bg-background', className)}>
      <StatusBar style='light' animated translucent />
      <Stack.Screen options={screenOptions} />
      {loading ?
        <LoadingScreen />
      : <>
          {waiting && (
            <Modal animationType='fade' statusBarTranslucent transparent>
              <LoadingScreen />
            </Modal>
          )}
          {children}
        </>
      }
    </Container>
  )
}
Screen.displayName = 'ui/Screen'

export function LoadingScreen() {
  return (
    <View className='flex-1 items-center justify-center gap-4 bg-background/85'>
      <Spinner className='color-primary' size={64} />
      <Text className='text-lg font-bold color-foreground'>Please wait...</Text>
    </View>
  )
}
Screen.Loading = LoadingScreen

export function CrashScreen(
  props: Partial<{ title: string | null; message: string | null; onRetry: () => void }>,
) {
  return (
    <View className='items-center gap-2 p-16'>
      <Image
        className='h-32 w-full'
        source={require('~/assets/icons/snap_error.png')}
        contentFit='contain'
      />
      {props.title === null || (
        <Text className='mt-8 text-center text-3xl font-bold color-foreground'>
          {props.title || 'Oops!'}
        </Text>
      )}
      {props.message === null || (
        <Text className='text-center color-foreground'>
          {props.message || 'Something went wrong'}
        </Text>
      )}
      {props.onRetry && (
        <Button className='mt-8 px-6' variant='outline' onPress={props.onRetry}>
          Retry
        </Button>
      )}
    </View>
  )
}
Screen.Crash = CrashScreen
