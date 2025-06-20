'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Share2Icon } from 'lucide-react'
import type { PropsWithChildren } from 'react'
import { ClientOnly } from '~/components/client-only'
import { Button } from '~/components/ui/button'
import { getQueryClient } from '~/lib/query'

export function Providers(props: PropsWithChildren) {
  // NOTE: Avoid useState when initializing the query client if you don't
  //       have a suspense boundary between this and the code that may
  //       suspend because React will throw away the client on the initial
  //       render if it suspends and there is no boundary
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      {props.children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export function ShareResultButton() {
  return (
    <ClientOnly>
      {() => {
        const shareData = { url: location.href }
        if (!navigator.canShare?.(shareData)) return null
        return (
          <Button
            variant='ghost'
            size='icon'
            onClick={async () => {
              await navigator.share(shareData).catch(() => {})
            }}
            title='Share Result'
            type='button'>
            <Share2Icon />
          </Button>
        )
      }}
    </ClientOnly>
  )
}
