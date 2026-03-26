import { queryOptions, experimental_streamedQuery as streamedQuery } from '@tanstack/react-query'

import type { ResultOutput } from '../server'

export type ResultQueryInput = {
  year?: string | null
  standard?: string | null
  roll?: string | null
}
export type ResultQueryOutput = ResultOutput & { rank: number }

const fetchResults = streamedQuery<
  ResultOutput,
  ResultOutput[],
  readonly [string, ResultQueryInput]
>({
  async streamFn({ queryKey }) {
    const params = {
      year: queryKey[1].year ?? '',
      class: queryKey[1].standard ?? '',
      roll: queryKey[1].roll ?? '',
    }
    const response = await fetch('/result?' + new URLSearchParams(params))
    const reader = response.body?.getReader()
    const decoder = new TextDecoder()

    return {
      async *[Symbol.asyncIterator]() {
        if (!reader) return null
        try {
          for (;;) {
            const { value, done } = await reader.read()
            if (done) break
            const parts = decoder.decode(value).split('<SPLIT>')
            for (const raw of parts) {
              if (raw) yield JSON.parse(raw)
            }
          }
        } finally {
          reader.releaseLock()
        }
        return
      },
    }
  },
})

export const getResultsOptions = (data: ResultQueryInput) =>
  queryOptions({
    queryKey: ['results', data] as const,
    enabled: !!(data.standard && data.roll),
    async queryFn(ctx) {
      const results = await fetchResults(ctx)

      const rankMap = results
        .toSorted((a, b) => b.percentage - a.percentage)
        .reduce<Record<string, number>>((acc, row, i) => ((acc[row.roll] = i + 1), acc), {})
      return results.map((r) => ({ ...r, rank: rankMap[r.roll]! }))
    },
    staleTime: Number.POSITIVE_INFINITY,
  })
