import Image from 'next/image'

import { ServerGroupType, ServerType, serverGroupSchema, serverSchema } from '~/discord/schemas'
import { firestore } from '~/utils/firebase.server'
import ServerCreateButton from './ServerCreateButton'
import ServerListItem from './ServerListItem'

async function fetchServers() {
  const [serverGroupsSnapshot, serversSnapshot] = await Promise.all([
    firestore.collection('apps/discord/serverGroups').get(),
    firestore.collection('apps/discord/servers').get(),
  ])
  const servers = serversSnapshot.docs.map((doc) =>
    serverSchema.parse({ ...doc.data(), id: doc.id })
  )

  const groupDataCache = serverGroupsSnapshot.docs.reduce(
    (cache, group) =>
      cache.set(group.id, serverGroupSchema.parse({ ...group.data(), id: group.id })),
    new Map<string, ServerGroupType>()
  )

  const obj: Record<
    string,
    ServerType | (ServerGroupType & { pingCount: number; servers: ServerType[] })
  > = {}

  for (const s of servers) {
    if (!s.group) {
      obj[s.id] = s
    } else if (s.group.id in obj) {
      // @ts-expect-error
      obj[s.group.id].servers.push(s)
      obj[s.group.id].pingCount += s.pingCount
    } else if (groupDataCache.has(s.group.id)) {
      obj[s.group.id] = { ...groupDataCache.get(s.group.id)!, pingCount: s.pingCount, servers: [s] }
    } else {
      obj[s.id] = s
    }
  }

  return Object.values(obj)
}

export default async function Sidebar() {
  const servers = await fetchServers()

  return (
    <aside className='flex h-full flex-col bg-slate-900'>
      <div className='flex items-center justify-evenly py-2'>
        <button className='rounded-full bg-rose-500 p-1.5' type='button' />
        <button className='rounded-full bg-amber-500 p-1.5' type='button' />
        <button className='rounded-full bg-emerald-500 p-1.5' type='button' />
      </div>
      <nav className='relative h-0 flex-1 overflow-y-auto scrollbar-none'>
        <NewPingLabel show />
        <ul className='isolate space-y-2 py-2'>
          <ServerListItem active href='/discord/me' name='Direct Messages'>
            <Image
              className='object-contain object-center p-2.5 invert'
              src='https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6918e57475a843f59f_icon_clyde_black_RGB.svg'
              alt="Discord's Logo"
              fill
            />
          </ServerListItem>
          <div className='peer mx-5 h-0.5 rounded-full bg-slate-50/10' />
          {/* <ServerListItem data={{}} /> */}
          {/* <ServerListItem data={{}} /> */}
          <div className='mx-5 h-0.5 rounded-full bg-slate-50/10 peer-empty:hidden' />
          {servers.map((server) =>
            'servers' in server ? (
              <ServerGroupListItem {...server} key={server.id} />
            ) : (
              <ServerListItem {...server} href={`/discord/${server.id}`} key={server.id} />
            )
          )}
          <ServerGroupListItem name='wow' servers={[]} />

          <li>
            <ServerCreateButton />
          </li>
        </ul>
      </nav>
    </aside>
  )
}

function ServerGroupListItem(props: {
  name: string
  color?: string
  pingCount?: number
  servers: ServerType[]
}) {
  return (
    <li className='relative'>
      <ul className='group relative isolate'>
        <div className='absolute inset-0 -z-10 mx-3 rounded-t-3xl rounded-b-5xl bg-slate-50/10 opacity-0 transition-all duration-500 group-[:has([data-toggle-folder]:checked)]:opacity-100' />

        <li className='relative z-10'>
          <span className='absolute top-1/2 left-0 h-2 w-1 -translate-y-1/2 rounded-r-full transition-all duration-300 group-[:has([data-toggle-folder]:not(:checked))]:bg-slate-50 peer-[:has(:first-child:hover)]:h-6' />
          <div className='relative mx-3'>
            {props.servers.length === 0 ? (
              <button
                className='aspect-square w-full rounded-2xl font-icon text-white/80 hover:bg-slate-50/10'
                style={props.color ? { color: props.color } : undefined}>
                folder
              </button>
            ) : (
              <label
                className='group pointer-events-box-only relative block aspect-square cursor-pointer overflow-hidden rounded-2xl bg-slate-50 bg-opacity-0 transition-all duration-300 hover:bg-opacity-10 group-[:has([data-toggle-folder]:not(:checked))]:bg-opacity-20'
                title={props.name}
                role='button'>
                <input className='absolute appearance-none' data-toggle-folder type='checkbox' />
                <span className='absolute inset-0 grid -translate-y-full place-items-center opacity-0 transition-all duration-300 group-[:has([data-toggle-folder]:checked)]:translate-y-0 group-[:has([data-toggle-folder]:checked)]:opacity-100'>
                  <span
                    className='font-icon text-slate-50/80'
                    style={props.color ? { color: props.color } : undefined}>
                    folder
                  </span>
                </span>
                <span className='grid h-full grid-cols-2 grid-rows-2 items-stretch gap-1 p-1.5 transition-all duration-300 group-[:has([data-toggle-folder]:checked)]:translate-y-full group-[:has([data-toggle-folder]:checked)]:opacity-0'>
                  {props.color && (
                    <span
                      className='absolute inset-0 opacity-50'
                      style={{ backgroundColor: props.color }}
                    />
                  )}
                  {0 in props.servers && <span className='relative rounded-full bg-slate-900' />}
                  {1 in props.servers && <span className='relative rounded-full bg-slate-900' />}
                  {2 in props.servers && <span className='relative rounded-full bg-slate-900' />}
                  {3 in props.servers && <span className='relative rounded-full bg-slate-900' />}
                </span>
              </label>
            )}
            {props.pingCount! > 0 && (
              <span className='absolute bottom-0 right-0 z-10 rounded-full bg-rose-500 p-0.5 px-1 text-center text-xs leading-none text-slate-50 group-[:has([data-toggle-folder]:checked)]:opacity-0'>
                {props.pingCount}
              </span>
            )}
          </div>
        </li>

        {props.servers.map(({ group, ...server }) => (
          <ServerListItem {...server} href={`/discord/${server.id}`} key={server.id} />
        ))}
      </ul>
    </li>
  )
}

function NewPingLabel({ top = false, show = false }) {
  return (
    <button
      className={`absolute inset-x-2 z-10 p-1.5 text-xs font-bold leading-none disabled:opacity-0 ${
        top ? 'top-1 disabled:-top-10' : 'bottom-3 disabled:-bottom-6'
      } rounded-full bg-rose-500/80 text-slate-300 shadow-md transition-all`}
      disabled={!show}>
      NEW
    </button>
  )
}
