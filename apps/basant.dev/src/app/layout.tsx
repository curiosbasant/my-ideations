import './globals.css'

import type { ComponentProps } from 'react'

import { geistMono, geistSans } from '~/lib/fonts'
import { getThemePreference } from './server'

export const metadata = {
  title: 'Myself Basant',
  description: "Hello I'm Basant",
}

export default function RootLayout(props: LayoutProps) {
  return (
    <Html className='size-full selection:bg-primary/25' lang='en'>
      <body className={`${geistSans.variable} ${geistMono.variable} isolate size-full antialiased`}>
        {props.children}
      </body>
    </Html>
  )
}

async function Html(props: ComponentProps<'html'>) {
  const themePreference = await getThemePreference()

  return <html {...props} data-theme={themePreference} />
}
