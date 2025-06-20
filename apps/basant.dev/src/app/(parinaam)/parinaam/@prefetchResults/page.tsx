import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { getQueryClient } from '~/lib/query'
import { type HomeProps, getResultsOptions } from '../shared'

export default async function PrefetchResults(props: HomeProps) {
  const { year, standard, roll } = await props.searchParams
  if (!standard || !roll) return null

  const queryClient = getQueryClient()
  await queryClient.prefetchQuery(getResultsOptions({ year, standard, roll }))
  return <HydrationBoundary state={dehydrate(queryClient)} />
}
