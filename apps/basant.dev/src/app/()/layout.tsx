import '~/app/tailwind.css'
import './theme.css'

import { geistMono, geistSans } from '~/app/shared'

export const metadata = {
  title: 'Myself Basant',
  description: "Hello I'm Basant",
}

export default function RootLayout(props: LayoutProps) {
  return (
    <html className='size-full antialiased' lang='en'>
      <body className={`${geistSans.variable} ${geistMono.variable} isolate size-full`}>
        {props.children}
      </body>
    </html>
  )
}
