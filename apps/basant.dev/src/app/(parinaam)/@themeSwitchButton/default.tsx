import { ThemeSwitchButton } from './client'
import { getThemePreference } from '../../server'

export default async function ThemeButton() {
  const themePreference = await getThemePreference()

  return <ThemeSwitchButton themePreference={themePreference} />
}
