import { PageProps } from '~/types/utilities.type'
import UserAvatar from '../UserAvatar'

export default function MeDiscordPage(props: PageProps) {
  return (
    <>
      <header className='flex shrink-0 basis-12 items-center divide-x divide-slate-600 border-b border-slate-800/50 shadow'>
        <div className='flex items-center gap-2 whitespace-nowrap px-4 text-slate-300'>
          <span className='font-icon'>person</span>
          <span className='align-middle font-bold'>Friends</span>
        </div>
        <nav className='flex flex-1 gap-4 px-4'>
          <ul className='contents'>
            {['Online', 'All', 'Pending', 'Blocked'].map((n, i) => (
              <li className='' key={i}>
                <button
                  className={`inline-block rounded px-2 ${
                    !i ? 'bg-slate-50/10 text-slate-300' : 'hover:bg-slate-50/5'
                  }`}>
                  {n}
                </button>
              </li>
            ))}
            <li className=''>
              <button className='inline-block rounded bg-emerald-600 px-2 text-slate-200 shadow'>
                Add Friend
              </button>
            </li>
          </ul>
          <button className='ml-auto font-icon'>add_comment</button>
        </nav>
        <div className='flex items-center gap-4 px-4'>
          <button className='ml-auto font-icon'>chat</button>
          <button className='ml-auto font-icon'>help</button>
        </div>
      </header>
      <div className='flex h-0 flex-1 divide-x divide-slate-600'>
        <main className='flex flex-1 flex-col px-8 py-4'>
          <label className='relative block'>
            <input
              className='h-8 w-full rounded border-none bg-slate-900/50 pl-2 pr-10 text-slate-300 placeholder:text-slate-400'
              placeholder='Search'
              type='search'
            />
            <span className='absolute right-1 top-1 align-middle font-icon'>search</span>
          </label>
          <div className='mt-2 select-none py-4 text-xs font-bold uppercase tracking-wide'>
            Online &mdash; 6
          </div>
          <section className='-mx-8 h-0 flex-1 overflow-y-scroll px-4'>
            <ul className=''>
              {[...Array(16)].map((n, i) => (
                <FriendListItem key={i} />
              ))}
            </ul>
          </section>
        </main>

        {/* Activity list */}
        <aside className='shrink-0 basis-96 p-4'>
          <h2 className='text-xl font-bold text-slate-300'>Active Now</h2>
          <div className='py-8 text-center'>
            <b className='text-sm text-slate-300'>It's quit for now...</b>
            <p className='mt-1 text-xs'>
              When a friend starts an activity &ndash; like playing a game or hanging out with on
              voice &ndash; we'll show it here!
            </p>
          </div>
          <ul className='mt-4 space-y-4'>
            {[1, 2, 3 /* 4, 5, 6 */].map((n, i) => (
              <li
                className='space-y-4 rounded-md border border-slate-600 bg-slate-800 bg-opacity-50 p-4 transition hover:bg-opacity-75'
                key={i}>
                <div className='flex items-center gap-3'>
                  <UserAvatar presence='offline' ringColor='slate-700' />
                  <div className='grow'>
                    <div className='font-bold text-slate-300'>aminoxix</div>
                    <div className=''>
                      <p className='text-xs'>IntelliJ IDEA Community - 23m</p>
                    </div>
                  </div>
                  <div className='h-8 w-8 shrink-0 rounded-full bg-slate-600 shadow-inner'></div>
                </div>
                <div className=' rounded-md bg-slate-700 p-3'>
                  <div className='flex'>
                    <div className='h-10 w-10 rounded-md bg-slate-800/50 shadow-inner'></div>
                    <div className=''></div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </>
  )
}

function FriendListItem() {
  return (
    <li className='group rounded-md px-3 hover:bg-slate-50/10'>
      <div className='flex gap-3 border-t border-slate-600 py-3'>
        <UserAvatar presence='online' ringColor='slate-600' />
        <div className='w-0 flex-1 justify-evenly'>
          <div className='leading-none'>
            <small className='font-bold text-slate-300'>Smurfy</small>
            <span className='text-xs opacity-0 transition-opacity group-hover:opacity-100'>
              #3472
            </span>
          </div>
          <p className='truncate text-xs'>
            You can be wrong half the time, and still make a fortune Lorem ipsum dolor sit amet,
            consectetur adipisicing elit. Optio vel libero quos placeat itaque non. Illo commodi
            quibusdam mollitia, assumenda accusamus ut saepe id iusto, modi incidunt fuga maiores
            ratione?
          </p>
        </div>
        <div className='flex items-center gap-3 self-center'>
          <button className='h-8 w-8 rounded-full bg-slate-800 bg-opacity-50 font-icon text-lg group-hover:bg-opacity-75'>
            message
          </button>
          <button className='h-8 w-8 rounded-full bg-slate-800 bg-opacity-50 font-icon text-lg group-hover:bg-opacity-75'>
            more_vert
          </button>
        </div>
      </div>
    </li>
  )
}
