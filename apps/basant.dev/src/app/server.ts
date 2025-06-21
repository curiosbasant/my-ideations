import { cache } from 'react'
import { cookies } from 'next/headers'

import { COOKIE_THEME_KEY, type ThemePreference } from './shared'

export const getThemePreference = cache(async () => {
  const cookieStore = await cookies()
  return cookieStore.get(COOKIE_THEME_KEY)?.value as ThemePreference | undefined
})
