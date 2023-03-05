import '~/globals.css'

import { PropsWithChildren } from 'react'
import { latoFont, materialIcon } from '~/utils/fonts'

export default function RootLayout(props: PropsWithChildren) {
  return (
    <html lang='en' className={`${latoFont.variable} ${materialIcon.variable}`}>
      <head>
        <link rel='font-icon' href='/favicon.ico' />
        <link
          href='https://fonts.googleapis.com/icon?family=Material+Icons+Round'
          rel='stylesheet'
        />
        <link
          href='https://fonts.googleapis.com/icon?family=Material+Icons+Outlined'
          rel='stylesheet'
        />
        <link
          href='https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200'
          rel='stylesheet'
        />
      </head>
      <body>{props.children}</body>
    </html>
  )
}
