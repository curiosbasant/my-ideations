export type ThemeResolved = 'light' | 'dark'
export type ThemePreference = ThemeResolved | 'system'

export const COOKIE_THEME_KEY = 'theme-preference'
export const DEFAULT_THEME_VALUE: ThemePreference = 'system'

export function resolveThemePreference(themePreference: string) {
  if (themePreference === 'dark' || themePreference === 'light') {
    return themePreference
  }
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  return isDark ? 'dark' : 'light'
}
