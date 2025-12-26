import type { Metadata } from 'next'

import { FileDownloadButton } from '~/app/client.component'
import { getPublicUrlFromShortcode } from '../server'
import { FileDownloadingText } from './client.component'

export const metadata: Metadata = {
  title: 'Download',
}

export default async function SnapFileDownloadPage(props: PageProps<'/s/snapfile/[shortcode]'>) {
  const { shortcode } = await props.params
  const publicUrl = await getPublicUrlFromShortcode(shortcode)

  return (
    <div className='flex h-full flex-col items-center justify-center gap-6'>
      <h2 className='text-balance text-center text-4xl font-bold'>
        <FileDownloadingText />
      </h2>
      <p className='text-sm'>if not, try using the button below</p>
      <FileDownloadButton url={publicUrl} autoDownload>
        Download File
      </FileDownloadButton>
    </div>
  )
}
