import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

/**
 * This is being used to mutate some data.
 * It refreshes the page once request fulfills
 *
 * Note: We're using this approach, since next hasn't released a native solution yet.
 */
export default function useMutation<T>(fetcher: (data: T) => unknown | Promise<unknown>) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isFetching, setIsFetching] = useState(false)

  return {
    isMutating: isFetching || isPending,
    async mutate(data: T) {
      setIsFetching(true)
      const res = await fetcher(data)
      setIsFetching(false)

      startTransition(() => {
        // Refresh the current route and fetch new data from the server without
        // losing client-side browser or React state.
        router.refresh()
      })

      return res
    },
  }
}
