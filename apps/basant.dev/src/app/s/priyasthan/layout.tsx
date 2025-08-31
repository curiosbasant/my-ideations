import '~/app/tailwind.css'
import './theme.css'

import Link from 'next/link'

import { latoFont } from '~/app/shared'
import { ScrollArea } from '~/components/ui/scroll-area'

export const metadata = {
  title: {
    default: 'Priyasthan',
    template: '%s | Priyasthan',
  },
  description: 'Instantly share files by scanning and generating QRCodes!',
}

export default function SnapFileRootLayout(props: LayoutProps<{ slots: 'headerProfile' }>) {
  return (
    <html lang='en' className='size-full antialiased'>
      <body className={`size-full ${latoFont.className}`}>
        <ScrollArea className='size-full'>
          <div className='isolate flex min-h-full w-full flex-col divide-y [--page-padding:--spacing(2)] [--page-size:var(--container-7xl)] sm:[--page-padding:--spacing(4)] md:[--page-padding:--spacing(8)]'>
            <header className='bg-background/80 px-(--page-padding) sticky top-0 z-10 backdrop-blur-sm'>
              <div className='max-w-(--page-size) m-auto flex items-center gap-4 py-3'>
                <Link href='/' className='inline-flex items-center gap-4'>
                  <div className='bg-secondary size-8 rounded-md' />
                  <span className='@2xs:text-2xl text-xl font-extrabold'>Priyasthan</span>
                </Link>
                {props.headerProfile}
              </div>
            </header>
            <div className='px-(--page-padding) bg-secondary flex flex-1'>
              <main className='max-w-(--page-size) mx-auto w-full pb-16 pt-8'>
                {props.children}
              </main>
            </div>
          </div>
        </ScrollArea>
      </body>
    </html>
  )
}
