import { cache, Suspense, type PropsWithChildren } from 'react'
import { cookies } from 'next/headers'

import { ScriptInline } from '@my/core/elements'

import { ThemeProvider as ThemeProviderClient } from './provider'
import {
  COOKIE_THEME_KEY,
  DEFAULT_THEME_VALUE,
  resolveThemePreference,
  type ThemePreference,
} from './shared'

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

export function ScriptAutoApplyTheme() {
  function fn(
    resolveThemePreference: (v: string) => string,
    cookieThemeKey: string,
    defaultThemeValue: string,
  ) {
    try {
      function getCookieValue(cookieName: string) {
        const regex = new RegExp(`(?:^|; )${cookieName}=([^;]*)`)
        return document.cookie.match(regex)?.[1] ?? null
      }
      const themePreference = getCookieValue(cookieThemeKey) ?? defaultThemeValue
      document.documentElement.dataset['theme'] = resolveThemePreference(themePreference)
    } catch {
      document.documentElement.dataset['theme'] = resolveThemePreference(defaultThemeValue)
    }
  }

  return (
    <ScriptInline>{`(${fn})(
      ${resolveThemePreference},
      '${COOKIE_THEME_KEY}',
      '${DEFAULT_THEME_VALUE}'
    )`}</ScriptInline>
  )
}
