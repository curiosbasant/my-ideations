export default function ServerChannelList({}) {
  return (
    <aside className='h-full'>
      <div className='h-12 border-b border-slate-800/50 p-2 shadow'>
        <input
          className='h-full w-full rounded-md border-none bg-slate-800 text-sm text-slate-100 placeholder:text-slate-500'
          placeholder='Find or start a conversation'
          type='text'
        />
      </div>
      <div className='h-full p-2'>
        <button className='flex w-full items-center space-x-2 rounded-md py-1 px-2 text-slate-400 hover:bg-slate-600/75'>
          <span className='font-icon text-3xl'>person</span>
          <span className=''>Friends</span>
        </button>
        <div className='my-2 flex items-center justify-between px-2 text-slate-400'>
          <span className='text-sm uppercase'>Direct Messages</span>
          <button className=''>
            <span className='font-icon text-xl'>add</span>
          </button>
        </div>
        <ul className='space-y-1'>
          {[1, 2, 3].map((n, i) => (
            <li className='' key={i}>
              <button className='group flex w-full items-center gap-4 rounded-md py-1 px-2 text-slate-400 hover:bg-slate-600/75'>
                <div className='relative h-10 w-10 rounded-full bg-slate-600'>
                  <span className='absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-slate-700'></span>
                </div>
                <span className=''>Friends</span>
                <div className='ml-auto opacity-0 group-hover:opacity-100'>
                  <span className='font-icon text-xl'>close</span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}
