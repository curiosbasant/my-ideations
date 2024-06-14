import { PropsWithChildren } from 'react'

import UserArea from './UserArea'

export default function ChannelListSidebar(props: PropsWithChildren) {
  return (
    <aside className='flex shrink-0 basis-60 flex-col bg-slate-800'>
      {props.children}
      <UserArea />
    </aside>
  )
}
