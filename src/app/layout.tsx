import './globals.css'

import { latoFont, materialIcon } from '~/lib/fonts'

export const metadata = {
  title: 'SnapFile',
  description: 'Instantly share files by scanning and generating QRCodes!',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' className='h-full w-full'>
      <body
        className={`h-full w-full bg-slate-100 text-slate-500 ${latoFont.className} ${materialIcon.variable}`}>
        {children}
      </body>
    </html>
  )
}
