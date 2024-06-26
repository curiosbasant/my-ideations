import 'react-native-reanimated'
import '../styles.css'

import { useEffect } from 'react'
import { useFonts } from 'expo-font'
import { Slot, SplashScreen } from 'expo-router'

import { useSession } from '~/features/auth'
import { useTheme } from '~/features/theme'
import { TRPCProvider } from '~/lib/trpc'
import { Stack, Toast } from '~/ui'

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  return (
    <TRPCProvider>
      <Toast.Provider>
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
      <Stack.Screen name='(protected)/groups/[groupId]/index' />
      <Stack.Screen
        name='(protected)/groups/[groupId]/members/index'
        options={{ title: 'Members' }}
      />
      <Stack.Screen
        name='(protected)/groups/[groupId]/members/invite'
        options={{ title: 'Invite Member' }}
      />
      <Stack.Screen name='(protected)/groups/[groupId]/spend' options={{ title: 'Add Spend' }} />
      <Stack.Screen name='(protected)/settings/change-theme' options={{ title: 'Change Theme' }} />

      <Stack.Screen name='+not-found' />
    </Stack>
  )
}
