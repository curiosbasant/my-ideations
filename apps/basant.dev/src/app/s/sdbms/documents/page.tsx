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
          <li className='bg-background flex gap-2 rounded-md border p-2' key={doc.id}>
            <div className='rounded-xs overflow-clip'>
              <img src={doc.signedUrl!} className='object-contain' />
            </div>
            <div className='flex-1'>
              <p className='text-muted-foreground text-sm font-bold'>{doc.type}</p>
              <p className='font-bold tabular-nums'>{doc.number}</p>
            </div>
          </li>
        ))}
      </ul>
}
