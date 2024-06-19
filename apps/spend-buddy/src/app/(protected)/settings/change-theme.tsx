import { setStatusBarStyle } from 'expo-status-bar'
import { useColorScheme } from 'nativewind'

import { SettingItem } from '~/components/setting-item'
import { Screen } from '~/components/ui'
import { useStorage } from '~/lib/storage'

type ThemeValue = 'light' | 'dark' | 'system'

export default function ChangeThemeScreen() {
  const { colorScheme, setColorScheme } = useColorScheme()
  const [preference, setPreference] = useStorage<ThemeValue>('theme-preference')
  const currentTheme = preference ?? colorScheme ?? 'system'

  const handleThemeChange = (theme: ThemeValue) => {
    setColorScheme(theme)
    setPreference(theme)
    // Keeping status bar light, as header is always dark
    setStatusBarStyle('light')
  }

  return (
    <Screen className='gap-6 px-0'>
      <ThemeItem currentTheme={currentTheme} theme='system' onThemeChange={handleThemeChange} />
      <ThemeItem currentTheme={currentTheme} theme='light' onThemeChange={handleThemeChange} />
      <ThemeItem currentTheme={currentTheme} theme='dark' onThemeChange={handleThemeChange} />
    </Screen>
  )
}

function ThemeItem(props: {
  currentTheme: ThemeValue
  theme: ThemeValue
  onThemeChange: (theme: ThemeValue) => void
}) {
  return (
    <SettingItem
      iconName={props.currentTheme === props.theme ? 'dot-circle' : 'circle'}
      label={props.theme}
      onPress={() => {
        props.onThemeChange(props.theme)
      }}
    />
  )
}
