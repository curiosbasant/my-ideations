import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogProvider,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import { getDocuments } from '~/features/document/dal'
import { DocumentUpdateForm } from './client'

export default async function DocumentsPage() {
  const documents = await getDocuments()

  return documents.length === 0 ?
      <div className='rounded-lg border-2 border-dashed p-6'>
        <p className='text-muted-foreground text-balance text-center'>
          No documents found. Please add a document to get started.
        </p>
      </div>
    : <ul className='grid select-none grid-cols-[repeat(auto-fill,minmax(--spacing(96),1fr))] gap-4'>
        {documents.map((doc) => (
          <DialogProvider key={`${doc.personId}${doc.typeId}`}>
            <DialogTrigger asChild>
              <li className='bg-background hover:outline-primary/75 flex flex-col gap-4 rounded-md border p-2 outline-2 outline-transparent transition'>
                <div className='rounded-xs bg-secondary/50 aspect-video h-0 flex-1 overflow-clip'>
                  <img src={doc.signedUrl!} className='mx-auto h-full object-contain' />
                </div>
                <div className='space-y-2'>
                  <p className='font-bold tabular-nums'>{doc.number}</p>
                  <div className='flex items-center'>
                    <span className='text-muted-foreground text-sm font-bold'>{doc.typeName} </span>
                    {doc.relation && (
                      <span className='text-muted-foreground text-sm font-bold'>
                        &ensp;•&ensp;{doc.relation}
                      </span>
                    )}
                  </div>
                  {doc.note && (
                    <div className='bg-secondary/50 rounded-sm border border-dashed p-1 px-2'>
                      <p className='text-secondary-foreground text-sm'>{doc.note}</p>
                    </div>
                  )}
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
