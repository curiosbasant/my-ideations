import { Pressable, Text, View } from 'react-native'
import { Link, Redirect } from 'expo-router'
import { useColorScheme } from 'nativewind'

import { useSession } from '~/features/auth/hooks'
import { useNotificationsUnreadCount } from '~/features/notification'
import { Icon, Tabs, type IconName } from '~/ui'

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
        name='settings'
        options={{ title: 'Settings', tabBarIcon: getTabIconByName('cog-outline', 'cog') }}
      />
      <Tabs.Screen
        name='groups'
        options={{
          headerRight: (props) => (
            <Link href='/groups/create' asChild>
              <Pressable
                className='items-center justify-center rounded-full p-1 px-2'
                android_ripple={{ color: props.pressColor, radius: 30 }}>
                <Icon name='plus' color={props.tintColor} size={26} />
              </Pressable>
            </Link>
          ),
          title: 'Groups',
          tabBarIcon: getTabIconByName('account-group-outline', 'account-group'),
        }}
      />
      <Tabs.Screen
        name='notifications'
        options={{
          title: 'Notifications',
          tabBarIcon: getNotificationIcon,
        }}
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
      size={props.size * 0.9}
    />
  )

const getNotificationIcon = (props: { focused: boolean; color: string; size: number }) => (
  <View>
    {getTabIconByName('bell-outline', 'bell')(props)}
    <NotificationBadge />
  </View>
)

function NotificationBadge() {
  const { data } = useNotificationsUnreadCount()

  if (!data?.count) return null

  return (
    <View className='absolute -right-2 -top-1 size-5 items-center justify-center rounded-full bg-destructive'>
      <Text className='text-sm leading-tight text-destructive-foreground'>{data.count}</Text>
    </View>
  )
}
