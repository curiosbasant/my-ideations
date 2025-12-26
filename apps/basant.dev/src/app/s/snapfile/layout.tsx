import '~/app/tailwind.css'
import './theme.css'

import type { PropsWithChildren } from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { latoFont } from '~/app/shared'
import { Button } from '~/components/ui/button'
import { ScrollArea } from '~/components/ui/scroll-area'

export const metadata: Metadata = {
  title: {
    default: 'Snap File',
    template: '%s | Snap File',
  },
  description: 'Instantly share files by scanning and generating QRCodes!',
}

export default function SnapFileRootLayout(props: PropsWithChildren) {
  return (
    <html lang='en' className='size-full antialiased'>
      <body className={`size-full ${latoFont.className}`}>
        <ScrollArea className='size-full'>
          <div className='isolate flex min-h-full w-full flex-col divide-y [--page-padding:--spacing(2)] [--page-size:var(--container-7xl)] sm:[--page-padding:--spacing(4)] md:[--page-padding:--spacing(8)]'>
            <header className='bg-background/80 px-(--page-padding) sticky top-0 z-10 backdrop-blur-sm'>
              <div className='max-w-(--page-size) m-auto flex items-center gap-4 py-3'>
                <Link href='/' className='inline-flex items-center gap-4'>
                  <Image src='/public/icons/snapfile.png' width={32} height={32} alt='Logo' />
                  <span className='@2xs:text-2xl text-xl font-extrabold'>Snap File</span>
                </Link>
                <Button className='text-base' variant='ghost' asChild>
                  <Link href='/scan'>Scan QR</Link>
                </Button>
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
