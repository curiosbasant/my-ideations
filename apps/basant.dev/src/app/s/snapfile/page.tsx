'use client'

import { useRouter } from 'next/navigation'
import { UploadIcon } from 'lucide-react'

import { useAction } from '~/app/client'
import { Button } from '~/components/ui/button'
import { zipFiles } from '~/lib/utils'
import { uploadFileAction } from './client.action'
import { Spinner } from './shared.component'

export default function SnapFileHomePage() {
  const router = useRouter()
  const { isPending, actionTransition: uploadFile } = useAction({
    actionFn: uploadFileAction,
    onSuccess(data) {
      router.push(`/${data.shortcode}/qrcode`)
    },
  })

  if (isPending) {
    return (
      <div className='flex h-full items-center justify-center gap-4'>
        <Spinner /> Uploading files...
      </div>
    )
  }

  const handleFiles = async (files: File[]) => {
    if (files.length === 0) {
      return
    }

    const fileToUpload = files.length > 1 ? await zipFiles(files) : files[0]
    uploadFile(fileToUpload)
  }

  return (
    <div
      className='flex h-full flex-col items-center justify-center gap-4 rounded-2xl border-4 border-dotted bg-white'
      onDragOver={(ev) => {
        // Prevent files from being opened in the browser
        ev.preventDefault()
      }}
      onDrop={(ev) => {
        ev.preventDefault()

        if (!ev.dataTransfer.items) {
          handleFiles([...ev.dataTransfer.files])
        } else if (ev.dataTransfer.items[0].kind === 'file') {
          handleFiles(Array.from(ev.dataTransfer.items, (item) => item.getAsFile()!))
        }
      }}>
      <p className=''>Drop your files here to share!</p>
      <span className=''>or</span>
      <Button asChild>
        <label>
          <input
            className='swoosh'
            multiple
            onChange={async (ev) => {
              handleFiles([...ev.currentTarget.files!])
            }}
            type='file'
          />
          <UploadIcon className='size-5' /> Select Files
        </label>
      </Button>
    </div>
  )
}
