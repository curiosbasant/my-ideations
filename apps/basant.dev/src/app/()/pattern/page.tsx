import { Spinner } from '~/components/ui/spinner'

export default async function Pattern() {
  return (
    <div className='flex size-full bg-black'>
      <div className='size-100 resize overflow-auto border'>
        <div
          className='aspect-square max-h-full rounded-md bg-gray-800'
          style={{
            '--board-size': 8,
            '--bg-size': 'calc(200% / var(--board-size))',
            background:
              'repeating-conic-gradient(transparent -90deg 0, black 0 90deg) top left / var(--bg-size) var(--bg-size)',
            backgroundColor: 'violet',
          }}></div>
      </div>
      {/* <Spinner className='scale-510 m-auto text-white' /> */}
    </div>
  )
  await new Promise((res) => setTimeout(res, 10000))
  return (
    <div className='-m-16 size-full bg-black'>
      {/* <div
        className='size-full'
        style={{
          background: 'url(/image4.jpg) top ',
        }}></div> */}
    </div>
  )
}
