import 'react-native-reanimated'
import '../styles.css'

import { SplashScreen, Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { useColorScheme } from 'nativewind'

import { Toast } from '~/components/ui/toast'
import { TRPCProvider } from '~/lib/trpc'

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const { colorScheme } = useColorScheme()

  return (
    <TRPCProvider>
      <Toast.Provider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} animated translucent />
          <Stack screenOptions={{ animation: 'slide_from_right', headerShadowVisible: true }}>
            <Stack.Screen name='(auth)/login' options={{ title: 'Login', animation: 'none' }} />
            <Stack.Screen name='(auth)/register' options={{ title: 'Create Account' }} />

            <Stack.Screen name='(protected)' options={{ headerShown: false }} />
            <Stack.Screen name='change-theme' options={{ title: 'Change Theme' }} />

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
        </ThemeProvider>
      </Toast.Provider>
    </TRPCProvider>
  )
}
