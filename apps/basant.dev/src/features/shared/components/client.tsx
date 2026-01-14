'use client'

import { Suspense, use, type ComponentProps } from 'react'

import { ThemeContext } from '~/features/theme/provider'

export function HtmlThemed(props: ComponentProps<'html'>) {
  const { themeResolved } = use(ThemeContext)
  return <html {...props} data-theme={themeResolved} />
}

export function CurrentYear() {
  return (
    <Suspense>
      <CurrentYearInner />
    </Suspense>
  )
}
function CurrentYearInner() {
  return <span suppressHydrationWarning>{new Date().getFullYear()}</span>
}
