import UserProfileIcon from "./UserProfileIcon"

export default function GuildMemberList() {
  return (
    <aside className="flex shrink-0 basis-72 flex-col bg-slate-700">
      <div className="h-0 grow overflow-y-auto">
        <ul className="space-y-1 p-2">
          <RoleLabel label="Admin" count="2" />
          <MemberListItem data="Ankit" />
          <MemberListItem data="Ankit" />
          <RoleLabel label="Online Members" count="32" />
          {[...Array(32)].map((n, i) => (
            <MemberListItem data={i + ""} key={i} />
          ))}
        </ul>
      </div>
    </aside>
  )
}

function RoleLabel({ label, count }: { label: string; count: number | string }) {
  return (
    <div className="p-2 pb-0 text-sm font-semibold uppercase">
      {label} - {count}
    </div>
  )
}

function MemberListItem({ data = "" }) {
  return (
    <li className="group rounded p-2 hover:bg-slate-50/5">
      <div className="flex gap-4">
        <UserProfileIcon presence="idle" ringColor="slate-700" />
        <div className="flex grow flex-col">
          <div className="">
            <span className="text-slate-300">Ashish Chawda {data}</span>
          </div>
          <div className="">
            <p className="truncate text-sm">
              {/* Pursuit of perfection is procrastination in disguise. */}
            </p>
          </div>
        </div>
      </div>
    </li>
  )
}
