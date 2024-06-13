import { useReactQueryDevTools } from '@dev-plugins/react-query'
import { useState, type PropsWithChildren } from 'react'

import {
  QueryClient,
  QueryClientProvider,
  type QueryClientConfig
} from '@tanstack/react-query'


const queryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
    },
  },
}

export function ReactQueryProvider(props: PropsWithChildren) {
  const [queryClient] = useState(() => new QueryClient(queryClientConfig))
  useReactQueryDevTools(queryClient)

  return (
    <QueryClientProvider client={queryClient}>{props.children}</QueryClientProvider>
  )
}

