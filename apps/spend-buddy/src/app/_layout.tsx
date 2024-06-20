import 'react-native-reanimated'
import '../styles.css'

import { useEffect } from 'react'
import { useFonts } from 'expo-font'
import { Slot, SplashScreen } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

import { Stack, Toast } from '~/components/ui'
import { useSession } from '~/features/auth'
import { useTheme } from '~/features/theme'
import { TRPCProvider } from '~/lib/trpc'

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  return (
    <TRPCProvider>
      <Toast.Provider>
        <StatusBar style='light' animated translucent />
          <StackScreens />
      </Toast.Provider>
    </TRPCProvider>
  )
}

function StackScreens() {
  // Load and set theme, imperatively
  useTheme()
  const { isLoading } = useSession()
  const [isFontLoaded] = useFonts({
    SpaceMono: require('~/assets/fonts/SpaceMono-Regular.ttf'),
  })

  const shouldWait = isLoading || !isFontLoaded

  useEffect(() => {
    if (!shouldWait) {
      SplashScreen.hideAsync()
    }
  }, [shouldWait])

  if (shouldWait) return <Slot />

  return (
    <Stack
      headerClassName='bg-primary color-primary-foreground'
      screenOptions={{ animation: 'slide_from_right' }}>
      <Stack.Screen name='(auth)/login' options={{ title: 'Login', animation: 'none' }} />
      <Stack.Screen name='(auth)/register' options={{ title: 'Create Account' }} />

      <Stack.Screen name='(protected)/(tabs)' options={{ headerShown: false }} />
      <Stack.Screen name='(protected)/groups/create' options={{ title: 'Create Group' }} />
      <Stack.Screen name='(protected)/settings/change-theme' options={{ title: 'Change Theme' }} />

      <Stack.Screen
        name='loading'
        options={{
          animation: 'fade',
          presentation: 'transparentModal',
          headerShown: false,
        }}
      />
      <Stack.Screen name='+not-found' />
    </Stack>
  )
}
