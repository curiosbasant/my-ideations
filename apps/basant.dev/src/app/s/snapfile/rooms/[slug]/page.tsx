import { format } from 'date-fns/format'
import { DownloadIcon } from 'lucide-react'

import { formatDistance } from '@my/lib/date'

import { TimeFormat } from '~/features/shared/components/client'
import { FileDownloadButton } from '~/features/shared/components/file-download-button'
import { FilePreview } from '~/features/shared/components/file-preview'
import { getRoomFiles } from '~/features/snapfile/dal'

export default async function RoomPage(props: PageProps<'/s/snapfile/rooms/[slug]'>) {
  const { slug } = await props.params
  const files = await getRoomFiles({ slug })

  return (
    <div className=''>
      <ul className='grid grid-cols-[repeat(auto-fill,minmax(min(--spacing(80),100%),1fr))] grid-rows-[1fr_auto_auto] gap-4 select-none'>
        {files.map((file) => (
          <li
            className='row-span-2 grid grid-rows-subgrid gap-0 rounded-md border bg-background'
            key={file.id}>
            <div className='m-2 aspect-video overflow-clip rounded-xs bg-secondary/50'>
              <FilePreview mimetype={file.mimetype ?? ''} url={file.url} />
            </div>
            <div className='flex items-center justify-between p-2'>
              <div className='flex flex-1 flex-col'>
                <strong className='line-clamp-1'>{file.originalName}</strong>
                <TimeFormat
                  className='text-sm'
                  dateTime={file.lastModifiedAt.toString()}
                  formattedTime={format(file.lastModifiedAt, 'PPpp')}
                  distanceTime={formatDistance(file.lastModifiedAt)}
                />
              </div>
              <FileDownloadButton
                variant='secondary'
                size='icon'
                url={`${file.url}?download=${file.originalName || ''}`}>
                <DownloadIcon />
              </FileDownloadButton>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
