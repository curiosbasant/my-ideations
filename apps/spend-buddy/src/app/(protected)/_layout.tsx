import { useEffect } from 'react'
import { Pressable, Text } from 'react-native'
import { useFonts } from 'expo-font'
import { Redirect, SplashScreen, Tabs } from 'expo-router'
import { useColorScheme } from 'nativewind'

import { Icon, type IconName } from '~/components/ui'
import { useSession } from '~/features/auth/hooks'
import LoadingScreen from '../loading'

export default function ProtectedLayout() {
  const { data, isSuccess, isLoading } = useSession()
  const [isFontLoaded] = useFonts({
    SpaceMono: require('~/assets/fonts/SpaceMono-Regular.ttf'),
  })

  const shouldWait = isLoading || !isFontLoaded

  useEffect(() => {
    if (!shouldWait) {
      SplashScreen.hideAsync()
    }
  }, [shouldWait])

  if (shouldWait) return <LoadingScreen />

  return data && isSuccess ? (
    <Tabs
      initialRouteName='index'
      screenOptions={{
        headerShadowVisible: true,
        tabBarButton(props) {
          const { colorScheme } = useColorScheme()
          return (
            <Pressable
              {...props}
              android_ripple={{
                color: colorScheme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
              }}
            />
          )
        },
        tabBarLabel: (props) => (
          <Text className={`text-xs ${props.focused ? 'color-primary' : 'color-muted-foreground'}`}>
            {props.children}
          </Text>
        ),
      }}>
      <Tabs.Screen
        name='index'
        options={{ title: 'Groups', tabBarIcon: getTabIconByName('users') }}
      />
      <Tabs.Screen
        name='settings'
        options={{ title: 'Settings', tabBarIcon: getTabIconByName('cog') }}
      />
    </Tabs>
  ) : (
    <Redirect href='/login' />
  )
}

const getTabIconByName =
  (iconName: IconName, activeIconName = iconName) =>
  (props: { focused: boolean; color: string; size: number }) => (
    <Icon
      name={props.focused ? activeIconName : iconName}
      className={props.focused ? 'color-primary' : 'color-muted-foreground'}
      size={props.size * 0.75}
    />
  )
