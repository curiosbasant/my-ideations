'use client'

import { use, type ComponentProps } from 'react'

import { ThemeContext } from '~/features/theme/provider'

export function HtmlThemed(props: ComponentProps<'html'>) {
  const { themeResolved } = use(ThemeContext)
  return <html {...props} data-theme={themeResolved} />
}
