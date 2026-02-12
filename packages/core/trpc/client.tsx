'use client'

import { useState, type PropsWithChildren } from 'react'
import { isServer, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createTRPCClient, httpBatchLink } from '@trpc/client'
import { createTRPCContext } from '@trpc/tanstack-react-query'

import type { AppRouter } from '@my/api'
import { SuperJSON } from '@my/lib/superjson'
import { getRootOrigin } from '@my/lib/utils'

export * from '@trpc/client'

const { TRPCProvider, useTRPC, useTRPCClient } = createTRPCContext<AppRouter>()
export { useTRPC as useTrpc, useTRPCClient as useTrpcClient }

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000,
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined = undefined
function getQueryClient() {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient()
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    browserQueryClient ??= makeQueryClient()
    return browserQueryClient
  }
}

const getTrpcClient = () =>
  createTRPCClient<AppRouter>({
    links: [
      httpBatchLink({
        url: `${getRootOrigin()}/api/trpc`,
        headers: { 'x-trpc-source': 'client' },
        fetch(url, options) {
          return fetch(url, {
            ...options,
            credentials: 'include',
          })
        },
        transformer: SuperJSON,
      }),
    ],
  })

export function TrpcClientProvider(props: PropsWithChildren) {
  const queryClient = getQueryClient()
  const [trpcClient] = useState(getTrpcClient)

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {props.children}
      </TRPCProvider>
    </QueryClientProvider>
  )
}
