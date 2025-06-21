import type { ComponentProps } from 'react'
import { StyleSheet, type TextStyle, type ViewStyle } from 'react-native'
import { Stack as ExpoStack, Tabs as ExpoTabs } from 'expo-router'
import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs'
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack'
import { cssInterop } from 'nativewind'

// *** Tabs ***

type ExpoTabProps = ComponentProps<typeof ExpoTabs>

function CustomTabs({
  headerStyle,
  headerRightContainerStyle,
  tabBarStyle,
  tabBarActiveStyle,
  tabBarLabelStyle,
  ...props
}: ExpoTabProps
  & Partial<{
    headerStyle: ViewStyle & TextStyle
    headerRightContainerStyle: ViewStyle & TextStyle
    tabBarStyle: ViewStyle & TextStyle
    tabBarActiveStyle: ViewStyle & TextStyle
    tabBarLabelStyle: TextStyle
  }>) {
  const screenOptions: BottomTabNavigationOptions = {
    headerRightContainerStyle,
    tabBarLabelStyle,
  }

  if (headerStyle) {
    const {
      display: headerDisplay,
      color: headerTintColor,
      ...restHeaderStyle
    } = StyleSheet.flatten(headerStyle)
    screenOptions.headerStyle = restHeaderStyle
    screenOptions.headerShown = headerDisplay !== 'none'
    screenOptions.headerShadowVisible = restHeaderStyle.elevation !== 0
    screenOptions.headerTintColor = headerTintColor as string
  }

  if (tabBarStyle) {
    const {
      backgroundColor: tabBarInactiveBackgroundColor,
      color: tabBarInactiveTintColor,
      ...restTabBarStyle
    } = StyleSheet.flatten(tabBarStyle)
    screenOptions.tabBarStyle = restTabBarStyle
    screenOptions.tabBarInactiveBackgroundColor = tabBarInactiveBackgroundColor as string
    screenOptions.tabBarInactiveTintColor = tabBarInactiveTintColor as string
  }

  if (tabBarActiveStyle) {
    const { backgroundColor: tabBarActiveBackgroundColor, color: tabBarActiveTintColor } =
      StyleSheet.flatten(tabBarActiveStyle)
    screenOptions.tabBarActiveBackgroundColor = tabBarActiveBackgroundColor as string
    screenOptions.tabBarActiveTintColor = tabBarActiveTintColor as string
  }

  return (
    <ExpoTabs
      {...props}
      screenOptions={{
        ...screenOptions,
        ...props.screenOptions,
      }}
    />
  )
}

export const Tabs = Object.assign(
  cssInterop(CustomTabs, {
    headerClassName: 'headerStyle',
    headerRightContainerClassName: 'headerRightContainerStyle',
    tabBarClassName: 'tabBarStyle',
    tabBarActiveClassName: 'tabBarActiveStyle',
    tabBarLabelClassName: 'tabBarLabelStyle',
  }),
  {
    Screen: ExpoTabs.Screen,
  },
)

// *** Stack ***

type ExpoStackProps = ComponentProps<typeof ExpoStack>

function CustomStack({
  headerStyle,
  headerRightContainerStyle,
  ...props
}: ExpoStackProps
  & Partial<{
    headerStyle: ViewStyle & TextStyle
    headerRightContainerStyle: ViewStyle & TextStyle
  }>) {
  const screenOptions: NativeStackNavigationOptions = {}

  if (headerStyle) {
    const {
      display: headerDisplay,
      color: headerTintColor,
      ...restHeaderStyle
    } = StyleSheet.flatten(headerStyle)
    // @ts-expect-error colors would always be strings anyway
    screenOptions.headerStyle = restHeaderStyle
    screenOptions.headerShown = headerDisplay !== 'none'
    screenOptions.headerShadowVisible = restHeaderStyle.elevation !== 0
    screenOptions.headerTintColor = headerTintColor as string
  }

  return (
    <ExpoStack
      {...props}
      screenOptions={{
        ...screenOptions,
        ...props.screenOptions,
      }}
    />
  )
}

export const Stack = Object.assign(
  cssInterop(CustomStack, {
    headerClassName: 'headerStyle',
  }),
  {
    Screen: ExpoStack.Screen,
  },
)
