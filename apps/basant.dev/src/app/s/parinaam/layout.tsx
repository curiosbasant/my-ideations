import Image from 'next/image'
import Link from 'next/link'

import { ScrollArea } from '~/components/ui/scroll-area'
import { Providers, ShareResultButton } from './client'
import icon from './icon.svg'

export const metadata = {
  title: 'Pariksha Parinaam',
  description: 'See the result of whole class in a minute',
}

export default function ParinaamRootLayout(props: LayoutProps<{ slots: 'themeSwitchButton' }>) {
  return (
    <>
      <div className='mask-b-from-50% pointer-events-none absolute top-0 -z-10 h-2/3 w-full'>
        <div
          className='h-full opacity-[0.05] dark:invert'
          style={{ background: 'url(/bg-pattern.jpg) top / 600px' }}
        />
      </div>
      <ScrollArea className='light:bg-secondary size-full'>
        <div className='isolate flex min-h-full w-full flex-col divide-y [--page-padding:--spacing(2)] [--page-size:var(--container-7xl)] sm:[--page-padding:--spacing(4)] md:[--page-padding:--spacing(8)]'>
          <header className='bg-background/80 px-(--page-padding) sticky top-0 z-10 backdrop-blur-sm'>
            <div className='max-w-(--page-size) m-auto flex items-center gap-4 py-3'>
              <div className='@container flex-1'>
                <Link href='/' className='inline-flex items-center gap-4'>
                  <Image src={icon} width={26} height={26} alt='Logo' />
                  <span className='@2xs:text-2xl text-xl font-extrabold'>Pariksha Parinaam</span>
                </Link>
              </div>
              <ShareResultButton />
              {props.themeSwitchButton}
            </div>
          </header>
          <div className='px-(--page-padding) flex flex-1'>
            <main className='max-w-(--page-size) mx-auto w-full pb-16 pt-8'>
              <Providers>{props.children}</Providers>
            </main>
          </div>
          <footer className='bg-background px-(--page-padding)'>
            <div className='max-w-(--page-size) m-auto py-6'>
              <div className='flex flex-col justify-between gap-2 text-sm md:flex-row'>
                <p>
                  Made with ❤️ by{' '}
                  <a
                    className='text-blue-400 hover:text-blue-500'
                    href='https://www.github.com/curiosbasant/pariksha-parinaam'
                    target='_blank'>
                    Basant (Computer Instructor)
                  </a>
                </p>
                <span>©{new Date().getFullYear()}</span>
                <p>
                  Thanks to{' '}
                  <a
                    className='text-blue-400 hover:text-blue-500'
                    href='https://www.amarujala.com/'
                    target='_blank'>
                    amarujala.com
                  </a>{' '}
                  for the api 😉
                </p>
              </div>
            </div>
          </footer>
        </div>
      </ScrollArea>
    </>
  )
}
