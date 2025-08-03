'use client'

import { useState, type PropsWithChildren } from 'react'
import { CloudUploadIcon } from 'lucide-react'

import { useToggle } from '@my/core/hooks'
import { formatBytes } from '@my/lib/utils'

import { useAction } from '~/app/client'
import { DropArea } from '~/components/elements/drop-area'
import { Spinner } from '~/components/elements/spinner'
import { Button } from '~/components/ui/button'
import { DialogClose, DialogFooter } from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { uploadFileAction } from './client.action'

export function FileUploadModalViews() {
  const [file, setFile] = useState<File | null>(null)

  const handleFile = (files: File[]) => {
    setFile(files[0] || null)
  }

  return file ?
      <FileDetails file={file}>
        <div className='h-96 space-y-6'>
          <div className='space-y-2'>
            <Label htmlFor='file-name'>File Name</Label>
            <Input id='file-name' name='fileName' defaultValue={file.name} />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='file-description'>File Description (Optional)</Label>
            <Input
              id='file-description'
              name='fileDescription'
              placeholder='Enter a description for the file'
            />
          </div>
          <p>File size: {formatBytes(file.size)}</p>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant='outline'>Cancel</Button>
          </DialogClose>
          <Button type='submit'>Save File</Button>
        </DialogFooter>
      </FileDetails>
    : <DropArea
        className='group grid h-96 place-items-center content-center rounded-2xl border-2 border-dashed'
        activeClassName='border-primary bg-primary/10'
        onFilesDrop={handleFile}>
        <CloudUploadIcon className='group-data-[drag-over]:text-primary size-20 text-gray-400' />
        <p className='group-data-[drag-over]:text-primary text-gray-500'>
          Drag and drop your file here
        </p>
        <p className='group-data-[drag-over]:text-primary text-gray-500'>
          or click to select a file
        </p>
        <Button className='mt-4' variant='outline' asChild>
          <label>
            Select File
            <input
              className='hidden'
              onChange={(e) => {
                if (e.target.files) {
                  handleFile(Array.from(e.target.files))
                }
              }}
              type='file'
            />
          </label>
        </Button>
      </DropArea>
}

function FileDetails(props: PropsWithChildren<{ file: File }>) {
  const { isPending, actionTransition: uploadFile } = useAction({
    actionFn: uploadFileAction,
  })

  if (isPending) {
    return (
      <div className='grid h-96 place-items-center content-center gap-4'>
        <Spinner />
        <p className='text-sm text-gray-500'>Uploading your file...</p>
      </div>
    )
  }

  return (
    <form
      action={(fd) => {
        const fileName = fd.get('fileName') as string
        const fileDescription = fd.get('fileDescription') as string
        uploadFile({ file: props.file, fileName, fileDescription })
      }}>
      {props.children}
    </form>
  )
}

export function FormatTime(props: {
  dateTime: string
  formattedTime: string
  distanceTime: string
}) {
  const [isToggled, toggle] = useToggle()

  return (
    <time className='cursor-default' dateTime={props.dateTime} onClick={toggle}>
      {isToggled ? props.formattedTime : props.distanceTime}
    </time>
  )
}
