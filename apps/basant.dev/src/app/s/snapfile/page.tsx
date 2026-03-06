'use client'

import { useRouter } from 'next/navigation'
import { UploadIcon } from 'lucide-react'

import { DropArea } from '~/components/elements/drop-area'
import { Spinner } from '~/components/elements/spinner'
import { Button } from '~/components/ui/button'
import { actionUploadFiles } from '~/features/snapfile/actions.client'
import { useDalMutation } from '~/lib/dal/use-action'

export default function SnapFileHomePage() {
  const router = useRouter()
  const { isPending, actionTransition: handleUploadFiles } = useDalMutation(actionUploadFiles, {
    onSuccess(fileShortCode) {
      router.push(`/${fileShortCode}/qrcode`)
    },
  })

  if (isPending) {
    return (
      <div className='flex h-full items-center justify-center gap-4'>
        <Spinner /> Uploading files...
      </div>
    )
  }

  return (
    <DropArea
      className='bg-background flex h-full flex-col items-center justify-center gap-4 rounded-2xl border-4 border-dotted'
      activeClassName='border-primary bg-primary/10'
      enablePromptFile
      onFilesDrop={handleUploadFiles}>
      <p className=''>Drop your files here to share!</p>
      <span className=''>or</span>
      <Button asChild>
        <label>
          <input
            className='swoosh'
            multiple
            onChange={async (ev) => {
              const fileList = ev.currentTarget.files
              fileList?.length && handleUploadFiles(Array.from(fileList))
            }}
            type='file'
          />
          <UploadIcon className='size-5' /> Select Files
        </label>
      </Button>
    </DropArea>
  )
}
