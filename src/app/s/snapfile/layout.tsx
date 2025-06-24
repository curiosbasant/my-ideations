import './theme.css'

import { latoFont, materialIcon } from '~/app/shared'

export const metadata = {
  title: 'SnapFile',
  description: 'Instantly share files by scanning and generating QRCodes!',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' className='size-full'>
      <body
        className={`size-full bg-slate-100 text-slate-500 ${latoFont.className} ${materialIcon.variable}`}>
        {children}
      </body>
    </html>
  )
}
