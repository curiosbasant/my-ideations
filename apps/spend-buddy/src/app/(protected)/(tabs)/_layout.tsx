import { Pressable } from 'react-native'
import { Link, Redirect } from 'expo-router'
import { useColorScheme } from 'nativewind'

import { Icon, Tabs, type IconName } from '~/components/ui'
import { useSession } from '~/features/auth/hooks'

export default function TabsLayout() {
  const { colorScheme } = useColorScheme()
  const { data, isSuccess } = useSession()

  if (isSuccess && !data) return <Redirect href='/login' />

  const pressColor = colorScheme === 'dark' ? 'rgba(255,255,255,0.066)' : 'rgba(0,0,0,0.066)'

  return (
    <Tabs
      headerClassName='bg-primary color-primary-foreground'
      headerRightContainerClassName='pr-4'
      tabBarClassName='color-muted-foreground bg-secondary border-border'
      tabBarActiveClassName='color-primary bg-secondary'
      tabBarLabelClassName='mb-1'
      screenOptions={{
        headerPressColor: pressColor,
        tabBarButton: (props) => <Pressable {...props} android_ripple={{ color: pressColor }} />,
      }}>
      <Tabs.Screen
        name='groups'
        options={{
          headerRight: (props) => (
            <Link href='/groups/create' asChild>
              <Pressable
                className='items-center justify-center rounded-full p-1 px-2'
                android_ripple={{ color: props.pressColor, radius: 30 }}>
                <Icon name='plus' color={props.tintColor} size={20} />
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
      color={props.color}
      size={props.size * 0.75}
    />
  )
