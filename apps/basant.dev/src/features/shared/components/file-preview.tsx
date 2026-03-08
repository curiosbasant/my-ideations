export function FilePreview(props: { url: string; mimetype: string }) {
  if (props.mimetype === 'application/pdf')
    return (
      <iframe
        className='pointer-events-none h-full w-[calc(100%+15px)]'
        src={props.url + '#toolbar=0&navpanes=0&scrollbar=0'}
        loading='lazy'
      />
    )
  return <img className='mx-auto h-full object-contain' src={props.url} />
}
