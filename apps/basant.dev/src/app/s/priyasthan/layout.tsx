import '~/app/tailwind.css'
import './theme.css'

import type { Metadata } from 'next'
import Link from 'next/link'

import { ScrollArea } from '~/components/ui/scroll-area'
import { latoFont } from '~/features/shared/fonts'

export const metadata: Metadata = {
  title: {
    default: 'Priyasthan',
    template: '%s | Priyasthan',
  },
  description: 'A platform to find your mutual transfer buddy!',
}

export default function SnapFileRootLayout(props: LayoutProps<'/s/priyasthan'>) {
  return (
    <html lang='en' className='size-full antialiased'>
      <body className={`size-full ${latoFont.className}`}>
        <ScrollArea className='size-full'>
          <div className='isolate flex min-h-full w-full flex-col divide-y [--page-padding:--spacing(2)] [--page-size:var(--container-7xl)] sm:[--page-padding:--spacing(4)] md:[--page-padding:--spacing(8)]'>
            <header className='sticky top-0 z-10 bg-background/80 px-(--page-padding) backdrop-blur-sm'>
              <div className='m-auto flex max-w-(--page-size) items-center gap-4 py-3'>
                <Link href='/' className='inline-flex items-center gap-3'>
                  <img src='/public/icons/priyasthan.png' width={26} height={26} alt='Logo' />
                  <span className='text-xl font-extrabold @2xs:text-2xl'>Priyasthan</span>
                </Link>
                {props.headerProfile}
              </div>
            </header>
            {props.children}
          </div>
        </ScrollArea>
      </body>
    </html>
  )
}
