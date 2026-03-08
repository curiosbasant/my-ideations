import '~/app/tailwind.css'
import './theme.css'

import type { Metadata } from 'next'
import Link from 'next/link'

import { TrpcClientProvider } from '@my/core/trpc/client'

import { ScrollArea } from '~/components/ui/scroll-area'
import { Toaster } from '~/components/ui/sonner'
import { PathDocuments } from '~/features/sdbms/components/header-nav-path'
import {
  BannerDeviceOnline,
  CurrentYear,
  HtmlWithDataTheme,
} from '~/features/shared/components/client'
import { ProfileDropdownMenu } from '~/features/shared/components/profile-dropdown'
import { geistMono, geistSans } from '~/features/shared/fonts'
import { ThemeToggleGroupButton } from '~/features/theme/client'
import { ScriptAutoApplyTheme, ThemeProvider } from '~/features/theme/server'

export const metadata: Metadata = {
  title: {
    template: '%s | SDBMS',
    absolute: 'SDBMS',
  },
  description: 'Student DataBase Management System',
}

export default async function SdbmsRootLayout(props: LayoutProps<'/s/sdbms'>) {
  return (
    <ThemeProvider>
      <HtmlWithDataTheme className='size-full antialiased' lang='en'>
        <head>
          <ScriptAutoApplyTheme />
        </head>
        <body className={`${geistSans.variable} ${geistMono.variable} isolate size-full`}>
          <TrpcClientProvider>
            <div className='isolate size-full selection:bg-primary/25 light:bg-secondary'>
              <ScrollArea className='size-full'>
                <div className='isolate flex min-h-full w-full flex-col divide-y [--page-padding:--spacing(2)] [--page-size:var(--container-7xl)] sm:[--page-padding:--spacing(4)] md:[--page-padding:--spacing(8)]'>
                  <BannerDeviceOnline />
                  <header className='sticky top-0 z-10 bg-background/80 px-(--page-padding) backdrop-blur-sm'>
                    <div className='@container m-auto flex h-13 max-w-(--page-size) items-center gap-4'>
                      <Link href='/' className='inline-flex items-center gap-4'>
                        <span className='text-xl font-extrabold text-primary @xl:text-2xl'>
                          SDBMS
                        </span>
                      </Link>
                      <nav className='flex-1'>
                        <PathDocuments />
                      </nav>
                      <ProfileDropdownMenu />
                    </div>
                  </header>
                  <div className='flex flex-1 px-(--page-padding)'>
                    <main className='mx-auto w-full max-w-(--page-size) pt-8 pb-16'>
                      {props.children}
                    </main>
                  </div>
                  <footer className='bg-background px-(--page-padding)'>
                    <div className='m-auto max-w-(--page-size) py-4'>
                      <div className='flex flex-col items-center justify-between gap-2 text-sm sm:flex-row'>
                        <p>
                          Made with ❤️ by{' '}
                          <a
                            className='text-blue-400 hover:text-blue-500'
                            href='https://www.github.com/curiosbasant'
                            target='_blank'>
                            Basant (Computer Instructor)
                          </a>
                        </p>
                        <span>
                          ©<CurrentYear />
                        </span>
                        <ThemeToggleGroupButton />
                      </div>
                    </div>
                  </footer>
                </div>
              </ScrollArea>
            </div>
            <Toaster />
            {props.modals}
          </TrpcClientProvider>
        </body>
      </HtmlWithDataTheme>
    </ThemeProvider>
  )
}
