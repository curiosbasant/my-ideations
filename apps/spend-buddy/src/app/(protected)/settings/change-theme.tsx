import { SettingItem } from '~/features/global'
import type { ThemeValue } from '~/features/theme'
import { useStorage } from '~/lib/storage'
import { Screen } from '~/ui'

export default function ChangeThemeScreen() {
  const [preference, setPreference] = useStorage<ThemeValue>('theme-preference', 'system')

  return (
    <Screen className='gap-4 py-8'>
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
      icon={props.currentTheme === props.theme ? 'radiobox-marked' : 'radiobox-blank'}
      label={props.theme}
      onPress={() => {
        props.onThemeChange(props.theme)
      }}
    />
  )
}
