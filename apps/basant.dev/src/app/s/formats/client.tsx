'use client'

import { useState, type PropsWithChildren } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { CloudUploadIcon } from 'lucide-react'

import { formatBytes } from '@my/lib/utils'

import { useAction } from '~/app/client'
import { DropArea } from '~/components/elements/drop-area'
import { Spinner } from '~/components/elements/spinner'
import { Button } from '~/components/ui/button'
import { DialogClose, DialogFooter } from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { getQueryClient } from '~/lib/query'
import { uploadFileAction } from './client.action'

export function Providers(props: PropsWithChildren) {
  // NOTE: Avoid useState when initializing the query client if you don't
  //       have a suspense boundary between this and the code that may
  //       suspend because React will throw away the client on the initial
  //       render if it suspends and there is no boundary
  const queryClient = getQueryClient()

  return <QueryClientProvider client={queryClient}>{props.children}</QueryClientProvider>
}
// function SearchForm(props: { query?: string }) {
//   return (
//     <Form className='' action='' onChange={handleChange}>
//       <input
//         className='w-full rounded-md border px-4 py-3 text-xl'
//         name='query'
//         defaultValue={props.query ?? undefined}
//         placeholder='Search for a format'
//         type='search'
//       />
//     </Form>
//   )
// }

export function FileUploadModalViews() {
  const [view, setView] = useState<'select' | 'upload' | 'uploading' | 'success'>('select')

  return (
    view === 'select' ?
      <FileSelector
        onFilesSelect={async (files) => {
          setView('upload')
          await new Promise((resolve) => setTimeout(resolve, 1000))
          console.log('Files uploaded:', files)
          setView('success')
        }}
      />
    : view === 'upload' ?
      <FileSelector
        onFilesSelect={async (files) => {
          setView('upload')
          await new Promise((resolve) => setTimeout(resolve, 1000))
          console.log('Files uploaded:', files)
          setView('success')
        }}
      />
    : view === 'uploading' ?
      <div className='grid h-96 place-items-center content-center gap-4'>
        <Spinner />
        <p className='text-sm text-gray-500'>Uploading your file...</p>
      </div>
    : view === 'success' ? view
    : null
  )
}

export function FileSelector(props: { onFilesSelect: (files: File[]) => void }) {
  const [file, setFile] = useState<File | null>(null)

  const handleFile = (files: File[]) => {
    setFile(files[0] || null)
  }

  return file ?
      <FileDetails file={file} />
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
        <Button variant='outline' className='mt-4' asChild>
          <label>
            Select File
            <input
              type='file'
              className='hidden'
              onChange={(e) => {
                if (e.target.files) {
                  handleFile(Array.from(e.target.files))
                }
              }}
            />
          </label>
        </Button>
      </DropArea>
}

function FileDetails(props: { file: File }) {
  const { isPending, actionTransition: uploadFile } = useAction({
    actionFn: uploadFileAction,
    onSuccess(data) {
      // router.push(`/${data.shortcode}/qrcode`)
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
      className=''
      action={(fd) => {
        const fileName = fd.get('fileName') as string
        const fileDescription = fd.get('fileDescription') as string
        console.log({ fileName, fileDescription, file: props.file })
        uploadFile({ file: props.file, fileName, fileDescription })
      }}>
      <div className='h-96 space-y-6'>
        <div className='space-y-2'>
          <Label htmlFor='file-name'>File Name</Label>
          <Input id='file-name' name='fileName' defaultValue={props.file.name} />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='file-description'>File Description (Optional)</Label>
          <Input
            id='file-description'
            name='fileDescription'
            placeholder='Enter a description for the file'
          />
        </div>
        <p>File size: {formatBytes(props.file.size)}</p>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant='outline'>Cancel</Button>
        </DialogClose>
        <Button type='submit'>Save File</Button>
      </DialogFooter>
    </form>
  )
}
