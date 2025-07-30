import '~/app/tailwind.css'
import './theme.css'

import type { PropsWithChildren } from 'react'
import Link from 'next/link'

import { Button } from '~/components/ui/button'
import { ScrollArea } from '~/components/ui/scroll-area'

export default function GamesLayout(props: PropsWithChildren) {
  return (
    <html lang='en' className='size-full antialiased'>
      <body className='bg-secondary text-secondary-foreground flex size-full flex-col'>
        <ScrollArea className='size-full'>
          <div className='isolate flex h-full flex-col divide-y [--page-padding:--spacing(2)] [--page-size:var(--container-7xl)] sm:[--page-padding:--spacing(4)] md:[--page-padding:--spacing(8)]'>
            <header className='bg-background px-(--page-padding) sticky top-0 shadow-lg'>
              <div className='max-w-(--page-size) mx-auto flex h-14 items-center'>
                <Link href='/' className='text-3xl font-bold'>
                  Formats
                </Link>
                <Button className='ms-auto'>Upload Format</Button>
              </div>
            </header>
            <div className='px-(--page-padding) flex-1'>
              <main className='max-w-(--page-size) mx-auto flex h-full py-8'>{props.children}</main>
            </div>
            <footer className='bg-background px-(--page-padding)'>
              <div className='max-w-(--page-size) m-auto py-6'>
                <div className='flex flex-col justify-between gap-2 text-sm md:flex-row'>
                  <p>
                    Made with ❤️ by{' '}
                    <a
                      className='text-blue-400 hover:text-blue-500'
                      href='https://www.github.com/curiosbasant'
                      target='_blank'>
                      Basant (Computer Instructor)
                    </a>
                  </p>
                  <span>©{new Date().getFullYear()}</span>
                </div>
              </div>
            </footer>
          </div>
        </ScrollArea>
      </body>
    </html>
  )
}
