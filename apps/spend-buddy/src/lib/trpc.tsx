import { useState, type PropsWithChildren } from 'react'
import { useReactQueryDevTools } from '@dev-plugins/react-query'

import type { AppRouter } from '@my/api'
import {
  createTRPCClient,
  createTRPCReact,
  httpBatchLink,
  QueryClient,
  QueryClientProvider,
  TRPCClientError,
  type CreateTRPCClientOptions,
  type QueryClientConfig,
} from '@my/core/trpc'
import { SuperJSON } from '@my/lib/superjson'

import { Toast } from '~/components/ui'
import { SITE_URL } from '~/lib/utils/config'

const trpcClientOptions: CreateTRPCClientOptions<AppRouter> = {
  links: [
    httpBatchLink({
      transformer: SuperJSON,
      url: `${SITE_URL}/api/trpc`,
      headers() {
        const headers = new Map<string, string>()
        headers.set('x-trpc-source', 'expo-react')
        return Object.fromEntries(headers)
      },
    }),
  ],
}

/**
 * A set of type-safe hooks for consuming our API.
 */
export const api = createTRPCReact<AppRouter>()
export const caller = createTRPCClient<AppRouter>(trpcClientOptions)

const queryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: __DEV__ ? 0 : 5 * 60 * 1000,
    },
    mutations: {
      onError(error) {
        Toast.error(error.message)
      },
    },
  },
}

/**
 * A wrapper for our app that provides the TRPC context.
 */
export function TRPCProvider(props: PropsWithChildren) {
  const [trpcClient] = useState(() => api.createClient(trpcClientOptions))
  const [queryClient] = useState(() => new QueryClient(queryClientConfig))
  useReactQueryDevTools(queryClient)

  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{props.children}</QueryClientProvider>
    </api.Provider>
  )
}

export function isTrpcError(cause: unknown): cause is TRPCClientError<AppRouter> {
  return cause instanceof TRPCClientError
}

export type * from '@my/api'
