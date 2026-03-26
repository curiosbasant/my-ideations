import type { Metadata } from 'next/types'
import { format } from 'date-fns/format'
import { DownloadIcon } from 'lucide-react'

import type { RouterOutputs } from '@my/api'
import { formatDistance } from '@my/lib/date'
import { resolveStringParam } from '@my/lib/utils'

import { TimeFormat } from '~/features/shared/components/client'
import { FileDownloadButton } from '~/features/shared/components/file-download-button'
import { SearchQueryInput } from '~/features/shared/components/search-query-input'
import { getRecentFormats } from '~/features/snapfile/dal'

export const metadata: Metadata = {
  title: 'Formats',
  description: 'Search and download any file formats available.',
}

export default async function FormatsPage(props: PageProps<'/s/snapfile/formats'>) {
  const searchParams = await props.searchParams
  const query = resolveStringParam(searchParams['query'])
  const recentFormats = await getRecentFormats({ query }).catch(() => [])

  return (
    <div className='flex flex-1 flex-col gap-8'>
      <SearchQueryInput
        className='h-auto px-4 py-3 text-lg md:text-xl'
        defaultValue={query ?? undefined}
        placeholder='Search for a format'
      />
      <h2 className='text-2xl font-bold'>Recent Formats</h2>
      {recentFormats.length ?
        <ul className='grid grid-cols-[1fr_auto] gap-4'>
          {recentFormats.map((format) => (
            <FormatListItem format={format} key={format.id} />
          ))}
        </ul>
      : <div className='rounded-2xl border-2 border-dashed px-4 py-8'>
          <p className='text-center text-balance'>
            There are no formats matching your search query.
          </p>
        </div>
      }
    </div>
  )
}

function FormatListItem(props: { format: RouterOutputs['snapfile']['format']['list'][number] }) {
  return (
    <li className='col-span-2 grid grid-flow-col grid-cols-subgrid grid-rows-2 rounded-md border bg-background p-4'>
      <h3 className='text-lg font-bold'>{props.format.name}</h3>
      <div className=''>
        <p className='text-sm text-muted-foreground'>{props.format.description}</p>
        <p className='text-end text-xs text-muted-foreground'>
          <TimeFormat
            className='cursor-default'
            dateTime={props.format.createdAt.toJSON()}
            formattedTime={format(props.format.createdAt, 'PPpp')}
            distanceTime={formatDistance(props.format.createdAt)}
          />
        </p>
      </div>
      <FileDownloadButton
        className='col-start-2 row-span-2'
        url={`${props.format.url}?download=${props.format.name}`}
        variant='secondary'
        size='icon'>
        <DownloadIcon className='size-4' />
      </FileDownloadButton>
    </li>
  )
}
