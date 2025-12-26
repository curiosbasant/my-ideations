import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

import { resolveStringParam } from '@my/lib/utils'

import { getQueryClient } from '~/lib/query'
import { getResultsOptions } from '../shared'

export default async function PrefetchResults(props: PageProps<'/s/parinaam'>) {
  const { year, standard, roll } = await props.searchParams
  if (!standard || !roll) return null

  const queryClient = getQueryClient()
  await queryClient.prefetchQuery(
    getResultsOptions({
      year: resolveStringParam(year),
      standard: resolveStringParam(standard),
      roll: resolveStringParam(roll),
    }),
  )
  return <HydrationBoundary state={dehydrate(queryClient)} />
}
