'use client'

import type { PropsWithChildren } from 'react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { useNativeSearchParam } from '~/hooks/use-search-params'
import { useResults, useResultsQuery } from '../query'

export default function ResultLayout(props: LayoutProps<'/s/parinaam'>) {
  const { isLoading, data, error } = useResultsQuery()

  if (isLoading) {
    return (
      <div className='flex h-96'>
        <div className='border-primary m-auto animate-spin rounded-full border-4 border-s-transparent p-4' />
      </div>
    )
  }

  if (data && data.length > 0) {
    return (
      <>
        <h2 className='text-balance px-8 text-center text-2xl font-bold'>{data[0].school}</h2>
        <ResultTabs>
          <div className='flex items-center justify-between gap-4'>
            <TabsList>
              <TabsTrigger value='table'>Table</TabsTrigger>
              <TabsTrigger value='summary'>Summary</TabsTrigger>
            </TabsList>
            {data[0].stream && (
              <>
                <label className='ms-auto'>Stream:</label>
                <SelectStreamFilter />
              </>
            )}
          </div>
          <TabsContent value='table' asChild>
            {props.table}
          </TabsContent>
          <TabsContent value='summary' className='grid items-start gap-y-16 lg:grid-cols-[1fr_2fr]'>
            {props.summary}
          </TabsContent>
        </ResultTabs>
      </>
    )
  }

  if (error)
    return (
      <div className='rounded-sm border border-s-4 border-red-300 border-s-red-500 bg-red-200 p-6'>
        <p className='text-red-500'>
          There seems to be some problem. Please check your provided details and try again!
        </p>
      </div>
    )

  return null
}

function ResultTabs(props: PropsWithChildren) {
  const [tab, setTab] = useNativeSearchParam('tab', 'table')
  return (
    <Tabs className='gap-8' value={tab} onValueChange={(v) => setTab(v)}>
      {props.children}
    </Tabs>
  )
}

function SelectStreamFilter() {
  const results = useResults()
  const [param, setParam] = useNativeSearchParam('stream')

  const streamMap = Object.groupBy(results, (row) => row.stream)
  const allStreams = Object.entries(streamMap)

  return (
    <Select value={param ?? results[0].stream} onValueChange={setParam}>
      <SelectTrigger className='min-w-32 capitalize'>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {allStreams.map(([stream, rows]) => (
          <SelectItem className='capitalize' value={stream} key={stream}>
            {stream.toLowerCase()} ({rows?.length})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
