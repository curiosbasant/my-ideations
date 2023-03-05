import UserProfileIcon from './UserProfileIcon'

export default function ChannelMessageListItem() {
  return (
    <li className='group mb-2 px-4 py-1 hover:bg-slate-50/5'>
      <div className='flex gap-4'>
        <UserProfileIcon ringColor='slate-700' />
        <div className='flex flex-col'>
          <div className='flex grow items-start justify-between'>
            <div className=''>
              <span className='text-emerald-400'>Username</span>
              <span className='ml-1 text-sm'>14/03/2022</span>
            </div>
            <div className='-mt-5 flex h-8 rounded border border-slate-700 bg-slate-600 opacity-0 shadow transition-opacity group-hover:opacity-100'>
              <button
                className='h-8 w-8 font-icon text-slate-300 hover:bg-slate-50/5 hover:text-slate-200'
                type='button'>
                add_circle
              </button>
              <button
                className='h-8 w-8 font-icon text-slate-300 hover:bg-slate-50/5 hover:text-slate-200'
                type='button'>
                more_horiz
              </button>
            </div>
          </div>
          <p className='break-normal font-sans text-slate-300'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit corporis perferendis
            suscipit alias et, omnis amet, neque debitis commodi molestias odit modi adipisci nihil
            voluptatibus reprehenderit soluta. Repudiandae, ipsum laudantium?
          </p>
        </div>
      </div>
    </li>
  )
}
