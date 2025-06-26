import { getPublicUrlFromShortcode } from '../server'
import { FileDownloadButton, FileDownloadingText } from './client.component'

export const metadata = {
  title: 'Download',
}

export default async function SnapFileDownloadPage(props: PageProps<{ params: 'shortcode' }>) {
  const { shortcode } = await props.params
  const publicUrl = await getPublicUrlFromShortcode(shortcode)

  return (
    <div className='flex h-full flex-col items-center justify-center gap-6'>
      <h2 className='text-balance text-center text-4xl font-bold'>
        <FileDownloadingText />
      </h2>
      <p className='text-sm'>if not, try using the button below</p>
      <FileDownloadButton url={publicUrl} />
    </div>
  )
}
