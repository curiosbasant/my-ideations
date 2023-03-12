import { memberSchema } from '~/discord/schemas'
import { APPS } from '~/utils/firebase.server'
import UserAvatar from '../../UserAvatar'
import CreateMemberButton from './CreateMemberButton'

export default async function ChannelMemberList(props: { serverId: string }) {
  const membersSnapshot = await APPS.discord.collection(`servers/${props.serverId}/members`).get()
  const members = membersSnapshot.docs.map((member) =>
    memberSchema.parse({ ...member.data(), id: member.id })
  )

  return (
    <aside
      id='channel-view-side-panel'
      className='hidden shrink-0 basis-60 flex-col overflow-y-auto bg-slate-800 group-[:has(#member-list-toggle-button:checked)]/channel-view:flex'>
      <ul className='px-2 py-1'>
        {/* <RoleLabel label='Online' count='2' />
        <MemberListItem data='Ankit' />
        <MemberListItem data='Ankit' />
        <MemberListItem data='Ankit' /> */}
        <CreateMemberButton {...props} />
        <RoleLabel label='Online Members' count={members.length} />
        {members.map((member) => (
          <MemberListItem displayName={member.nickname!} status={member.status!} key={member.id} />
        ))}
      </ul>
    </aside>
  )
}

function RoleLabel(props: { label: string; count: number | string }) {
  return (
    <div className='mt-5 mb-1 select-none px-2 text-xs font-semibold uppercase'>
      {props.label} &mdash; {props.count}
    </div>
  )
}

function MemberListItem(props: { displayName: string; status?: string }) {
  return (
    <li className='group rounded px-2 py-1.5 hover:bg-slate-50/5'>
      <div className='flex gap-3'>
        <UserAvatar presence='idle' ringColor='slate-700' />
        <div className='flex w-0 flex-auto flex-col'>
          <span className='text-sm font-semibold leading-tight text-slate-300'>
            {props.displayName}
          </span>
          {props.status && <p className='truncate text-xs'>{props.status}</p>}
        </div>
      </div>
    </li>
  )
}
