'use client'

import { useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'

import { getResultsOptions } from './shared'

export function useResultsQuery() {
  const searchParams = useSearchParams()
  const year = searchParams.get('year')
  const standard = searchParams.get('standard')
  const roll = searchParams.get('roll')

  return useQuery(getResultsOptions({ year, standard, roll }))
}

export function useResults() {
  return useResultsQuery().data!
}

const noarr: [] = []
export function useFilteredResults() {
  const results = useResultsQuery().data ?? noarr
  const searchParams = useSearchParams()
  const stream = searchParams.get('stream')

  return stream && results.length > 0 ? results.filter((r) => r.stream === stream) : results
}
