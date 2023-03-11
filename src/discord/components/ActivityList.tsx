import UserProfileIcon from './UserProfileIcon'

export default function ActivityList() {
  return (
    <aside className='hidden basis-1/3 overflow-y-auto p-4 xl:block'>
      <h2 className='text-xl font-bold text-slate-300'>Active Now</h2>
      <ul className='mt-4 space-y-4'>
        {[1, 2, 3 /* 4, 5, 6 */].map((n, i) => (
          <li
            className='space-y-4 rounded-md bg-slate-700 p-4 transition hover:bg-slate-800'
            key={i}>
            <div className='flex items-center gap-3'>
              <UserProfileIcon presence='offline' ringColor='slate-700' />
              <div className='grow'>
                <div className='font-bold text-slate-300'>aminos</div>
                <div className=''>
                  <p className='text-xs'>IntelliJ IDEA Community - 23m</p>
                </div>
              </div>
              <div className='h-8 w-8 shrink-0 rounded-full bg-slate-600 shadow-inner'></div>
            </div>
            <div className=' rounded-md bg-slate-600 p-3'>
              <div className='flex'>
                <div className='h-10 w-10 rounded-md bg-slate-700 shadow-inner'></div>
                <div className=''></div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  )
}
