import { useState } from "react"
import { UserProfileIcon } from "."

export default function ChannelSidebar({ children }) {
  return (
    <aside className="flex shrink-0 grow-0 basis-72 flex-col bg-slate-700">
      <div className="flex grow flex-col">{children}</div>
      <section className=" bg-slate-800/60">
        <div className=""></div>
        <UserArea />
      </section>
    </aside>
  )
}

function UserArea() {
  return (
    <div className=" flex items-center gap-2 p-2">
      <UserProfileIcon ringColor="slate-800/60" />
      <div className="relative grow self-stretch">
        <div className="absolute inset-0 flex flex-col justify-evenly">
          <div className="">
            <span className="truncate text-sm font-bold leading-none text-slate-300">
              CuriosBasant
            </span>
          </div>
          <div className="">
            <p className="truncate text-xs leading-none text-slate-500">Just a few lines more...</p>
          </div>
        </div>
      </div>
      <div className="flex gap-1">
        <StrikeButton icon="mic" />
        <StrikeButton icon="headset" />

        <button
          className="h-8 w-8 rounded bg-slate-50 bg-opacity-0 p-1 pt-0.5 hover:bg-opacity-10"
          type="button">
          <span className="icon align-text-top leading-6 text-slate-400">settings</span>
        </button>
      </div>
    </div>
  )
}

function StrikeButton({ icon }: { icon: string }) {
  const [open, setOpen] = useState(true)
  return (
    <button
      className="relative h-8 w-8 rounded bg-slate-50 bg-opacity-0 p-1 hover:bg-opacity-10"
      onClick={() => setOpen(!open)}
      type="button">
      <span
        className={`absolute top-1 right-1 block ${
          open ? "h-0" : "h-8"
        } w-0.5 origin-top rotate-45 rounded-full bg-rose-500 transition-all`}
      />
      <span className="icon text-slate-400">{icon}</span>
    </button>
  )
}
