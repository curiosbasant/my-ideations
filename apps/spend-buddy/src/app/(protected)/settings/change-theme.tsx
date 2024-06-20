import { SettingItem } from '~/components/setting-item'
import { Screen } from '~/components/ui'
import type { ThemeValue } from '~/features/theme'
import { useStorage } from '~/lib/storage'

export default function ChangeThemeScreen() {
  const [preference, setPreference] = useStorage<ThemeValue>('theme-preference', 'system')

  return (
    <Screen className='gap-6 px-0'>
      <ThemeItem currentTheme={preference} theme='system' onThemeChange={setPreference} />
      <ThemeItem currentTheme={preference} theme='light' onThemeChange={setPreference} />
      <ThemeItem currentTheme={preference} theme='dark' onThemeChange={setPreference} />
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
