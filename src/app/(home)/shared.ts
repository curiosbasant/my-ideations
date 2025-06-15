import {
  type QueryFunctionContext,
  queryOptions,
  experimental_streamedQuery as streamedQuery,
} from '@tanstack/react-query'
import type { ResultOutput } from '~/lib/service'

export type HomeProps = PageProps<{ searchParams: 'year' | 'standard' | 'roll' | 'tab' | 'stream' }>

export type ResultQueryInput = {
  year?: string | null
  standard?: string | null
  roll?: string | null
}
export type ResultQueryOutput = ResultOutput & { rank: number }

export const getResultsOptions = (data: ResultQueryInput) =>
  queryOptions({
    queryKey: ['results', data],
    enabled: !!(data.standard && data.roll),
    queryFn,
    staleTime: Number.POSITIVE_INFINITY,
  })

async function queryFn<QKey extends [string, ResultQueryInput]>(ctx: QueryFunctionContext<QKey>) {
  const results = await streamedQuery<ResultQueryOutput, QKey>({
    async queryFn({ queryKey }) {
      const response = await fetch('/parinaam?' + new URLSearchParams(queryKey[1] as string))
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      return {
        async *[Symbol.asyncIterator]() {
          if (!reader) return null
          try {
            for (;;) {
              const { value, done } = await reader.read()
              if (done) break
              const result = decoder.decode(value).split('<SPLIT>')
              for (const seg of result) {
                if (seg) yield JSON.parse(seg)
              }
            }
          } finally {
            reader.releaseLock()
          }
        },
      }
    },
  })(ctx)

  const rankMap = results
    .toSorted((a, b) => b.percentage - a.percentage)
    .reduce((acc, row, i) => ((acc[row.roll] = i + 1), acc), {} as Record<string, number>)
  return results.map((r) => ({ ...r, rank: rankMap[r.roll] }))
}
