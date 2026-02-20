import '~/app/tailwind.css'
import './theme.css'

import type { Metadata } from 'next'
import Link from 'next/link'

import { TrpcClientProvider } from '@my/core/trpc/client'

import { Button } from '~/components/ui/button'
import { ScrollArea } from '~/components/ui/scroll-area'
import { Toaster } from '~/components/ui/sonner'
import { CurrentYear, HtmlWithDataTheme } from '~/features/shared/components/client'
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
          <div className='light:bg-secondary selection:bg-primary/25 isolate size-full'>
            <ScrollArea className='size-full'>
              <div className='isolate flex min-h-full w-full flex-col divide-y [--page-padding:--spacing(2)] [--page-size:var(--container-7xl)] sm:[--page-padding:--spacing(4)] md:[--page-padding:--spacing(8)]'>
                <header className='bg-background/80 px-(--page-padding) sticky top-0 z-10 backdrop-blur-sm'>
                  <div className='@container max-w-(--page-size) m-auto flex items-center gap-4 py-2'>
                    <Link href='/' className='inline-flex items-center gap-4'>
                      <span className='@xl:text-2xl text-primary text-xl font-extrabold'>
                        SDBMS
                      </span>
                    </Link>
                    <nav className='flex-1'>
                      <Button className='text-base' variant='ghost' asChild>
                        <Link href='/documents'>My Documents</Link>
                      </Button>
                    </nav>
                    <ProfileDropdownMenu />
                  </div>
                </header>
                <div className='px-(--page-padding) flex flex-1'>
                  <main className='max-w-(--page-size) mx-auto w-full pb-16 pt-8'>
                    <TrpcClientProvider>{props.children}</TrpcClientProvider>
                  </main>
                </div>
                <footer className='bg-background px-(--page-padding)'>
                  <div className='max-w-(--page-size) m-auto py-4'>
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
        </body>
      </HtmlWithDataTheme>
    </ThemeProvider>
  )
}
