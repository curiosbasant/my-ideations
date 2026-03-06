'use client'

import { use, useState, type PropsWithChildren } from 'react'
import { CloudUploadIcon } from 'lucide-react'

import { formatBytes } from '@my/lib/utils'

import { DropArea } from '~/components/elements/drop-area'
import { Spinner } from '~/components/elements/spinner'
import { Button } from '~/components/ui/button'
import { DialogClose, DialogContext, DialogFooter } from '~/components/ui/dialog'
import { FieldSet } from '~/components/ui/field'
import { FormControl } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { toast } from '~/components/ui/sonner'
import { Textarea } from '~/components/ui/textarea'
import { actionUploadFormatFile } from '~/features/snapfile/actions.client'
import { useDalMutation } from '~/lib/dal/use-action'

export default function FileUploadModalViews() {
  const [file, setFile] = useState<File | null>(null)

  const handleFile = (files: File[]) => {
    setFile(files[0] || null)
  }

  return file ?
      <FileDetails file={file}>
        <FieldSet className='h-96'>
          <FormControl label='File Name' fieldId='file-name'>
            <Input id='file-name' name='fileName' defaultValue={file.name} />
          </FormControl>
          <FormControl label='File Description' fieldId='file-description'>
            <Textarea
              id='file-description'
              name='fileDescription'
              placeholder='Enter a description for the file'
            />
          </FormControl>
          <p>File size: {formatBytes(file.size)}</p>
        </FieldSet>
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
        <CloudUploadIcon className='group-data-drag-over:text-primary size-20 text-gray-400' />
        <p className='group-data-drag-over:text-primary text-gray-500'>
          Drag and drop your file here
        </p>
        <p className='group-data-drag-over:text-primary text-gray-500'>or click to select a file</p>
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
  const setOpen = use(DialogContext)
  const { isPending, action: uploadFile } = useDalMutation(actionUploadFormatFile, {
    onSuccess() {
      setOpen(false)
      toast.success('Your format has been upload successfully!')
    },
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
