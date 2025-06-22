import { getThemePreference } from '~/app/server'
import { ThemeSwitchButton } from './client'

export default async function ThemeButton() {
  const themePreference = await getThemePreference()

  return <ThemeSwitchButton themePreference={themePreference} />
}
