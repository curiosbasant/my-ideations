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
      <div className='pointer-events-none absolute top-0 -z-10 h-2/3 w-full mask-b-from-50%'>
        <div
          className='h-full opacity-[0.05] dark:invert'
          style={{ background: 'url(/bg-pattern.jpg) top / 600px' }}
        />
      </div>
      <ScrollArea className='size-full light:bg-secondary'>
        <div className='isolate flex min-h-full w-full flex-col divide-y [--page-padding:--spacing(2)] [--page-size:var(--container-7xl)] sm:[--page-padding:--spacing(4)] md:[--page-padding:--spacing(8)]'>
          <header className='sticky top-0 z-10 bg-background/80 px-(--page-padding) backdrop-blur-sm'>
            <div className='m-auto flex max-w-(--page-size) items-center gap-4 py-3'>
              <div className='@container flex-1'>
                <Link href='/parinaam' className='inline-flex items-center gap-4'>
                  <Image src={icon} width={26} height={26} alt='Logo' />
                  <span className='text-xl font-extrabold @2xs:text-2xl'>Pariksha Parinaam</span>
                </Link>
              </div>
              <ShareResultButton />
              {props.themeSwitchButton}
            </div>
          </header>
          <div className='flex flex-1 px-(--page-padding)'>
            <main className='mx-auto w-full max-w-(--page-size) pt-8 pb-16'>
              <Providers>{props.children}</Providers>
            </main>
          </div>
          <footer className='bg-background px-(--page-padding)'>
            <div className='m-auto max-w-(--page-size) py-6'>
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
