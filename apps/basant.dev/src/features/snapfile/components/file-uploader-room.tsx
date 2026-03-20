'use client'

import { CloudUploadIcon, LoaderCircleIcon } from 'lucide-react'

import { getSupabaseClient } from '@my/lib/supabase/client'

import { DropArea } from '~/components/elements/drop-area'
import { Button } from '~/components/ui/button'
import { toast } from '~/components/ui/sonner'
import { createErrorReturn, createSuccessReturn } from '~/lib/dal/types'
import { useDalMutation } from '~/lib/dal/use-action'
import { zipFiles } from '~/lib/utils'
import { actionUploadRoomFile } from '../actions'

export function FileUploaderRoom(props: { slug: string }) {
  const { isPending, actionTransition } = useDalMutation(
    async (files: File[]) => {
      const fileToUpload = files.length > 1 ? await zipFiles(files) : files[0]
      const { roomId, path: filePath } = await actionUploadRoomFile({
        slug: props.slug,
        fileName: fileToUpload.name,
      })

      const supabase = getSupabaseClient()
      const bkt = supabase.storage.from('sf__files')
      const { error } = await bkt.upload(filePath, fileToUpload, {
        metadata: { fileName: fileToUpload.name },
      })
      if (error) {
        return createErrorReturn({ type: 'unknown-error', error })
      }
      return createSuccessReturn(roomId)
    },
    {
      onSuccess() {
        window.history.back()
        toast.success('Your file has been shared to the public!')
      },
    },
  )

  return (
    <DropArea
      className='group grid h-96 place-items-center content-center gap-2 rounded-2xl border-2 border-dashed'
      enablePromptFile
      activeClassName='border-primary bg-primary/10'
      onFilesDrop={actionTransition}
      disabled={isPending}>
      {isPending ?
        <>
          <LoaderCircleIcon className='size-6 animate-spin md:size-8' />
          <p className='text-sm text-muted-foreground'>uploading your file</p>
        </>
      : <>
          <CloudUploadIcon className='size-20 text-muted-foreground group-data-drag-over:text-primary' />
          <p className='text-center text-muted-foreground group-data-drag-over:text-primary'>
            Drag and drop your file here
            <br />
            or click to select a file
          </p>
          <Button className='mt-4' variant='outline'>
            Select File
          </Button>
        </>
      }
    </DropArea>
  )
}
