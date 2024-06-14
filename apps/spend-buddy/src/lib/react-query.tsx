import { useState, type PropsWithChildren } from 'react'
import { useReactQueryDevTools } from '@dev-plugins/react-query'
import { QueryClient, QueryClientProvider, type QueryClientConfig } from '@tanstack/react-query'

import { Toast } from '~/components/ui'

const queryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
    },
    mutations: {
      onError(error) {
        Toast.error(error.message)
      },
    },
  },
}

export function ReactQueryProvider(props: PropsWithChildren) {
  const [queryClient] = useState(() => new QueryClient(queryClientConfig))
  useReactQueryDevTools(queryClient)

  return <QueryClientProvider client={queryClient}>{props.children}</QueryClientProvider>
}

export * from '@tanstack/react-query'
