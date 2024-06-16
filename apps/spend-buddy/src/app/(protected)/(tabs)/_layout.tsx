import { Pressable, Text } from 'react-native'
import { Link, Redirect, Tabs } from 'expo-router'
import { useColorScheme } from 'nativewind'

import { Icon, type IconName } from '~/components/ui'
import { useSession } from '~/features/auth/hooks'

export default function TabsLayout() {
  const { colorScheme } = useColorScheme()
  const { data, isSuccess } = useSession()

  if (isSuccess && !data) return <Redirect href='/login' />

  const pressColor = colorScheme === 'dark' ? 'rgba(255,255,255,0.066)' : 'rgba(0,0,0,0.066)'

  return (
    <Tabs
      screenOptions={{
        headerPressColor: pressColor,
        headerShadowVisible: true,
        tabBarButton: (props) => <Pressable {...props} android_ripple={{ color: pressColor }} />,
        tabBarLabel: (props) => (
          <Text className={`text-xs ${props.focused ? 'color-primary' : 'color-muted-foreground'}`}>
            {props.children}
          </Text>
        ),
      }}>
      <Tabs.Screen
        name='groups'
        options={{
          headerRightContainerStyle: { paddingEnd: 14 },
          headerRight: (props) => (
            <Link href='/groups/create' asChild>
              <Pressable
                className='items-center justify-center rounded-full p-1 px-2'
                android_ripple={{ color: props.pressColor, radius: 30 }}>
                <Icon name='plus' className='color-foreground' size={22} />
              </Pressable>
            </Link>
          ),
          title: 'Groups',
          tabBarIcon: getTabIconByName('users'),
        }}
      />
      <Tabs.Screen
        name='settings'
        options={{ title: 'Settings', tabBarIcon: getTabIconByName('cog') }}
      />
    </Tabs>
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
