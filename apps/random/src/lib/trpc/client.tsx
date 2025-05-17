'use client'

import { useState, type PropsWithChildren } from 'react'

import type { AppRouter } from '@my/api'
import {
  createTRPCReact,
  unstable_httpBatchStreamLink as httpBatchStreamLink,
  loggerLink,
  QueryClient,
  QueryClientProvider,
} from '@my/core/trpc'
import { SuperJSON } from '@my/lib/superjson'

import { getBaseUrl } from '~/lib/utils'

export const api = createTRPCReact<AppRouter>()

export function TRPCProvider(props: PropsWithChildren<{ headersPromise: Promise<Headers> }>) {
  const [queryClient] = useState(() => new QueryClient())
  const [trpcClient] = useState(() =>
    api.createClient({
      links: [
        loggerLink({
          enabled: (op) =>
            process.env.NODE_ENV === 'development' ||
            (op.direction === 'down' && op.result instanceof Error),
        }),
        httpBatchStreamLink({
          transformer: SuperJSON,
          url: getBaseUrl() + '/api/trpc',
          async headers() {
            const headers = new Headers(await props.headersPromise)
            headers.set('x-trpc-source', 'nextjs-react')
            return headers
          },
        }),
      ],
    }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      <api.Provider client={trpcClient} queryClient={queryClient}>
        {props.children}
      </api.Provider>
    </QueryClientProvider>
  )
}
