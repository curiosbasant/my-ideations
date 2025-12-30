export type ThemeResolved = 'light' | 'dark'
export type ThemePreference = ThemeResolved | 'system'

export const COOKIE_THEME_KEY = 'theme-preference'
export const DEFAULT_THEME_VALUE: ThemePreference = 'system'
