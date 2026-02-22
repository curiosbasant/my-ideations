import { getDocuments } from '~/features/document/dal'

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
          <li className='bg-background flex flex-col gap-2 rounded-md border p-2' key={doc.id}>
            <div className='rounded-xs bg-secondary/50 aspect-video h-0 flex-1 overflow-clip'>
              <img src={doc.signedUrl!} className='mx-auto h-full object-contain' />
            </div>
            <div className=''>
              <p className='font-bold tabular-nums'>{doc.number}</p>
              <div className='flex items-center'>
                <span className='text-muted-foreground text-sm font-bold'>{doc.type} </span>
                {doc.relation && (
                  <span className='text-muted-foreground text-sm font-bold'>
                    &ensp;•&ensp;{doc.relation}
                  </span>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
}
