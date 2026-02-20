'use client'

import { useState, type ComponentProps } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { useTrpc } from '@my/core/trpc/client'
import { getSupabaseClient } from '@my/lib/supabase/client'

import { DropArea } from '~/components/elements/drop-area'
import { toast } from '~/components/ui/sonner'
import { actionAddDocument } from '~/features/document/actions'

export function DocumentView() {
  const [uploadingFile, setUploadingFile] = useState<{ url?: string; path?: string } | null>(null)
  const trpc = useTrpc()
  const query = useQueryClient()

  return (
    <DropArea
      className='group flex overflow-clip rounded-lg border-2 border-dashed'
      activeClassName='border-primary bg-primary/10'
      onFilesDrop={async ([file]) => {
        setUploadingFile((prev) => {
          prev?.url && URL.revokeObjectURL(prev.url)
          return { file, url: URL.createObjectURL(file) }
        })
        const obj = await query.ensureQueryData(
          trpc.person.document.getSignedUrl.queryOptions({ fileName: file.name }),
        )
        const supabase = getSupabaseClient()
        const bkt = supabase.storage.from('__documents')

        const { data, error } = await bkt.uploadToSignedUrl(obj.path, obj.token, file)
        if (error) {
          if (error.message === 'The resource already exists') {
            return setUploadingFile((prev) => ({ ...prev, path: obj.path }))
          }
          toast.error('Failed to upload file')
          return console.error(error)
        }
        setUploadingFile((prev) => ({ ...prev, path: data.path }))
      }}>
      {uploadingFile?.url ?
        <div className='flex flex-1'>
          <img
            src={uploadingFile.url}
            className='group-data-drag-over:opacity-20 m-auto object-contain'
          />
        </div>
      : <div className='m-auto'>
          <p className='text-muted-foreground text-balance text-center text-sm'>
            Drag and drop a file here to upload
          </p>
        </div>
      }
      <input name='filePath' value={uploadingFile?.path || ''} readOnly required type='hidden' />
    </DropArea>
  )
}

export function FormWrapper(props: ComponentProps<'form'>) {
  return (
    <form
      {...props}
      action={async (fd) => {
        const documentType = fd.get('documentType') as string
        const documentNo = fd.get('documentNo') as string
        const filePath = fd.get('filePath') as string

        if (!documentType || !documentNo) {
          toast.error('Please fill in all fields')
          return
        }
        if (!filePath) {
          toast.error('Please upload a document')
          return
        }
        await actionAddDocument({
          documentType: parseInt(documentType),
          documentNo,
          filePath,
        })
        toast.success('Document added successfully')
      }}
    />
  )
}
