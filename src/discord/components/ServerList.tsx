import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { NestedServer, ServerType } from '../types'

type ServerListProps = {
  servers: NestedServer[]
  activeServerId: string
  createNewServer?: (name: string) => void
}
export default function ServerList({ servers, activeServerId, createNewServer }: ServerListProps) {
  return (
    <div className='flex shrink-0 basis-20 flex-col bg-slate-800'>
      <div className='group flex items-center justify-between  p-3'>
        <button className='h-3.5 w-3.5 rounded-full bg-rose-400 text-transparent group-hover:text-rose-700'>
          <span className='align-top font-icon text-xs leading-4'>close</span>
        </button>
        <button className='h-3.5 w-3.5 rounded-full bg-yellow-400 text-transparent group-hover:text-yellow-700'>
          <span className='align-top font-icon text-xs leading-4'>remove</span>
        </button>
        <button className='h-3.5 w-3.5 rounded-full bg-green-400 text-transparent group-hover:text-green-700'>
          <span className='align-top font-icon text-xs leading-4'>open_in_full</span>
        </button>
      </div>
      <nav className='relative grow overflow-y-auto px-3'>
        <NewPingLabel top />
        <ul className='space-y-2 py-2'>
          <ServerListItem
            data={{ id: '@me', position: 0, name: 'Home' }}
            active={activeServerId == '@me'}
            //open={() => setActiveId("home")}
          />
          {['100', '200' /*, "300", "400", "500", "600" */].map((n, i) => (
            <ServerListItem
              data={{ id: `@me/${n}`, position: i + 1, name: `DM - ${n}` }}
              active={activeServerId == n}
              pingCount={5}
              // open={() => setActiveId(n)}
              key={i}
            />
          ))}
          <Divider />
          {servers.map((ser, i) =>
            'servers' in ser ? (
              <ServerGroupItem
                activeId={activeServerId}
                servers={ser.servers}
                // setActiveId={setActiveId}
                key={ser.id}
              />
            ) : (
              <ServerListItem
                data={ser}
                active={activeServerId == ser.id}
                // open={() => setActiveId(ser.id)}
                key={ser.id}
              />
            )
          )}
          <ServerItemButton icon='add' onClick={() => createNewServer?.('New Server')} />
          <ServerItemButton icon='explore' />
          <Divider />
          <ServerItemButton icon='download' />
        </ul>
        <NewPingLabel show />
      </nav>
    </div>
  )
}

type ListItemProps = {
  active?: boolean
  pingCount?: number
} & Pick<React.HTMLAttributes<HTMLLIElement>, 'title'>

function ListItem({
  active,
  pingCount = 0,
  title,
  children,
}: React.PropsWithChildren<ListItemProps>) {
  return (
    <li
      className={`flex items-center before:absolute before:left-0 before:block ${
        active ? 'before:h-8' : 'before:h-2 before:scale-y-125 hover:before:h-4'
      } before:w-1 before:rounded-r before:bg-white before:transition-all`}
      title={title}>
      <div className='relative aspect-square grow'>
        {children}
        {active && (
          <span className='absolute top-0 right-0 rounded-full bg-emerald-500 p-0.5 text-center font-icon text-xs font-semibold text-white ring-4 ring-slate-800'>
            volume_up
          </span>
        )}
        {pingCount > 0 && (
          <span className='absolute bottom-0 right-0 h-4 w-4 rounded-full bg-rose-500 text-center text-xs font-semibold text-white ring-4 ring-slate-800'>
            {pingCount}
          </span>
        )}
      </div>
    </li>
  )
}

type ServerListItemProps = {
  data: ServerType
  active?: boolean
  open?: () => void
  pingCount?: number
}
function ServerListItem({ data, ...props }: ServerListItemProps) {
  const router = useRouter()
  const query = { ...router.query }
  delete query.ids
  return (
    <ListItem {...props} title={data.name}>
      <Link
        href={{ pathname: `/discord/${data.id}`, query }}
        className={`block h-full bg-slate-600 shadow-inner ${
          props.active ? 'rounded-2xl' : 'rounded-4xl transition-all duration-300 hover:rounded-2xl'
        }`}
        shallow></Link>
    </ListItem>
  )
}

type ServerGroupItemProps = {
  activeId: string
  // setActiveId: Dispatch<SetStateAction<string>>
  servers: ServerType[]
}
export function ServerGroupItem({ activeId, servers }: ServerGroupItemProps) {
  const [expanded, setExpanded] = useState(false)
  function toggleExpand() {
    setExpanded(!expanded)
  }
  if (!expanded) {
    const active = servers.some((ser) => activeId == ser.id)

    return (
      <ListItem active={active} pingCount={8}>
        <button
          className='grid h-full w-full grid-cols-2 grid-rows-2 gap-1 rounded-2xl bg-slate-700 p-2 shadow-inner'
          onClick={toggleExpand}
          type='button'>
          <span className='inline-block h-full rounded-full bg-slate-400'></span>
          {1 in servers && <span className='inline-block h-full rounded-full bg-slate-400'></span>}
          {2 in servers && <span className='inline-block h-full rounded-full bg-slate-400'></span>}
          {3 in servers && <span className='inline-block h-full rounded-full bg-slate-400'></span>}
        </button>
      </ListItem>
    )
  }

  return (
    <ul className='space-y-2 rounded-b-3xl rounded-t-2xl bg-slate-600/25'>
      <li className=''>
        <button className='aspect-square w-full' onClick={toggleExpand} type='button'>
          <div className=' rounded-2xl py-2 shadow-inner transition-colors hover:bg-slate-700'>
            <span className='font-icon text-4xl text-slate-300'>folder</span>
          </div>
        </button>
      </li>
      {servers.map((ser) => (
        <ServerListItem data={ser} active={activeId == ser.id} key={ser.id} />
      ))}
    </ul>
  )
}

function ServerItemButton({ icon, onClick = undefined }: { icon: string; onClick?: () => void }) {
  return (
    <div className='mt-2'>
      <button className='group block h-full w-full' onClick={onClick} type='button'>
        <div className='flex aspect-square rounded-full bg-slate-600 shadow-inner hover:rounded-2xl group-hover:bg-green-500'>
          <span className='m-auto font-icon text-3xl font-thin text-green-500 group-hover:text-white'>
            {icon}
          </span>
        </div>
      </button>
    </div>
  )
}

function Divider() {
  return (
    <div className='px-3 py-1'>
      <span className='block h-0.5  w-full rounded-full bg-slate-700'></span>
    </div>
  )
}

function NewPingLabel({ top = false, show = false }) {
  return (
    <button
      className={`absolute inset-x-2 z-10 py-1 text-sm disabled:opacity-0 ${
        top ? 'top-1 disabled:-top-10' : 'bottom-3 disabled:-bottom-6'
      } rounded-full bg-rose-500/80 text-slate-300 shadow-md transition-all`}
      disabled={!show}>
      NEW
    </button>
  )
}
