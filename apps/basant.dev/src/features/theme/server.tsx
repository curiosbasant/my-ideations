import { cache, Suspense, type PropsWithChildren } from 'react'
import { cookies } from 'next/headers'

import { ThemeProvider as ThemeProviderClient } from './provider'
import { COOKIE_THEME_KEY, DEFAULT_THEME_VALUE, type ThemePreference } from './shared'

export function ThemeProvider(props: PropsWithChildren) {
  return (
    <Suspense fallback={props.children}>
      <ThemeProviderInner {...props} />
    </Suspense>
  )
}

async function ThemeProviderInner(props: PropsWithChildren) {
  const defaultThemePreference = await getThemePreference()
  return <ThemeProviderClient {...props} defaultTheme={defaultThemePreference} />
}

export const getThemePreference = cache(async () => {
  const cookieStore = await cookies()
  return (cookieStore.get(COOKIE_THEME_KEY)?.value as ThemePreference) || DEFAULT_THEME_VALUE
})
