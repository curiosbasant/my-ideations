import '~/app/tailwind.css'
import './theme.css'

import type { PropsWithChildren } from 'react'

import { latoFont } from '~/app/shared'

export const metadata = {
  title: 'SnapFile',
  description: 'Instantly share files by scanning and generating QRCodes!',
}

export default function SnapFileRootLayout(props: PropsWithChildren) {
  return (
    <html lang='en' className='size-full antialiased'>
      <body className={`size-full bg-slate-100 text-slate-500 ${latoFont.className}`}>
        {props.children}
      </body>
    </html>
  )
}
