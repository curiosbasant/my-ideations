import { useColorScheme } from 'nativewind'

import { SettingItem } from '~/components/setting-item'
import { Screen } from '~/components/ui'
import { useStorage } from '~/lib/storage'

export default function ChangeThemeScreen() {
  const { colorScheme, setColorScheme } = useColorScheme()
  const [preference, setPreference] = useStorage('theme-preference')
  const theme = preference ?? colorScheme

  return (
    <Screen className='gap-6 px-0'>
      <SettingItem
        iconName={theme === 'automatic' ? 'dot-circle' : 'circle'}
        label='Automatic'
        onPress={() => {
          setColorScheme('system')
          setPreference('automatic')
        }}
      />
      <SettingItem
        iconName={theme === 'light' ? 'dot-circle' : 'circle'}
        label='Light'
        onPress={() => {
          setColorScheme('light')
          setPreference(null)
        }}
      />
      <SettingItem
        iconName={theme === 'dark' ? 'dot-circle' : 'circle'}
        label='Dark'
        onPress={() => {
          setColorScheme('dark')
          setPreference(null)
        }}
      />
    </Screen>
  )
}
