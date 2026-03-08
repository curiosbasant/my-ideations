import { formatDistance } from '@my/lib/date'

import { Avatar, AvatarImage } from '~/components/ui/avatar'
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogProvider,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import { getDocuments } from '~/features/document/dal'
import { FilePreview } from '~/features/shared/components/file-preview'
import { DocumentUpdateForm } from './client'

export default async function DocumentsPage() {
  const documents = await getDocuments()

  return documents.length === 0 ?
      <div className='rounded-lg border-2 border-dashed p-6'>
        <p className='text-center text-balance text-muted-foreground'>
          No documents found. Please add a document to get started.
        </p>
      </div>
    : <ul className='grid grid-cols-[repeat(auto-fill,minmax(min(--spacing(80),100%),1fr))] grid-rows-[1fr_auto_auto] gap-4 select-none'>
        {documents.map((doc) => (
          <DialogProvider key={`${doc.personId}${doc.type.id}`}>
            <DialogTrigger asChild>
              <li className='row-span-3 grid grid-rows-subgrid gap-0 rounded-md border bg-background outline-2 outline-transparent transition hover:outline-primary/75 dark:hover:bg-secondary/25'>
                <div className='m-2 aspect-video overflow-clip rounded-xs bg-secondary/50'>
                  <FilePreview mimetype={doc.file.mimetype} url={doc.signedUrl!} />
                </div>
                <div className='space-y-2 p-2'>
                  <p className='font-bold tabular-nums'>{doc.number}</p>
                  <div className='flex items-center'>
                    <span className='text-sm font-bold text-muted-foreground'>{doc.type.name}</span>
                    {doc.relation && (
                      <span className='text-sm font-bold text-muted-foreground'>
                        &ensp;•&ensp;{doc.relation}
                      </span>
                    )}
                  </div>
                  {doc.note && (
                    <div className='rounded-sm border border-dashed bg-secondary/50 p-1 px-2'>
                      <p className='text-sm text-secondary-foreground'>{doc.note}</p>
                    </div>
                  )}
                </div>
                <div className='flex items-center justify-end gap-2 border-t p-2 text-muted-foreground'>
                  {doc.createdBy && (
                    <>
                      <Avatar size='sm'>
                        <AvatarImage src={doc.createdBy.avatarUrl || ''} />
                      </Avatar>
                      <span className='text-sm'>{doc.createdBy.displayName}</span>•
                    </>
                  )}
                  <span className='text-sm'>{formatDistance(doc.lastModifiedAt)}</span>
                </div>
              </li>
            </DialogTrigger>
            <DialogContent
              className='sm:max-w-3xl'
              showCloseButton={false}
              closeOnEscapeKeyDown={false}
              closeOnInteractOutside={false}>
              <DialogHeader>
                <DialogTitle>Edit a document</DialogTitle>
                <DialogDescription>
                  You can change any of the fields here except the document type.
                </DialogDescription>
              </DialogHeader>
              <DocumentUpdateForm document={doc} />
            </DialogContent>
          </DialogProvider>
        ))}
      </ul>
}
