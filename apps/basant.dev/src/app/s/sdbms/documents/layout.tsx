import type { Metadata } from 'next/types'

import { Button } from '~/components/ui/button'
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogProvider,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import { ensurePersonId } from '~/features/person/dal'
import { DocumentCreateForm } from './client'

export const metadata: Metadata = {
  title: 'Documents',
}

export default async function DocumentsLayout(props: LayoutProps<'/s/sdbms/documents'>) {
  await ensurePersonId()
  return (
    <div className='space-y-8'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl'>My Documents</h1>
        <DialogProvider>
          <DialogTrigger asChild>
            <Button size='sm'>New Document</Button>
          </DialogTrigger>
          <DialogContent
            className='sm:max-w-3xl'
            showCloseButton={false}
            closeOnEscapeKeyDown={false}
            closeOnInteractOutside={false}>
            <DialogHeader>
              <DialogTitle>Add a document</DialogTitle>
              <DialogDescription>
                Upload and save a document to your profile. You can view and edit them later.
              </DialogDescription>
            </DialogHeader>
            <DocumentCreateForm />
          </DialogContent>
        </DialogProvider>
      </div>
      {props.children}
    </div>
  )
}
