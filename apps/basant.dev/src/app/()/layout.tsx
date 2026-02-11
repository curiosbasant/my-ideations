import '~/app/tailwind.css'
import './theme.css'

import type { Metadata } from 'next'

import { geistMono, geistSans } from '~/features/shared/fonts'

export const metadata: Metadata = {
  title: 'Myself Basant',
  description: "Hello I'm Basant",
}

export default function RootLayout(props: LayoutProps<'/'>) {
  return (
    <html className='size-full antialiased' lang='en'>
      <body className={`${geistSans.variable} ${geistMono.variable} isolate size-full`}>
        {props.children}
      </body>
    </html>
  )
}
