import { ChannelType, MessageType } from "../types"
import GuildMemberList from "./GuildMemberList"
import PanelTop from "./PanelTop"
import UserProfileIcon from "./UserProfileIcon"

type ChannelMessageListProps = {
  channel: ChannelType
  messages: MessageType[]
}
export default function ChannelMessageList({ channel, messages }: ChannelMessageListProps) {
  return (
    <div className="flex grow flex-col bg-slate-600">
      <PanelTop>
        <div className="shrink-0 pr-4 pl-2">
          <span className="relative inline-block">
            <span className="icon  -skew-x-12">tag</span>
            {true && (
              <span className="icon absolute top-1 right-0 inline-block  rounded-sm bg-slate-600 p-px text-[0.5rem]">
                lock
              </span>
            )}
          </span>
          <span className="ml-1 text-slate-300">{channel.name}</span>
        </div>
        <div className="relative  grow border-l border-slate-500/75">
          <p className="absolute inset-0 truncate  pl-4 text-sm">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iure, explicabo! Sint enim
            molestiae ex ut impedit voluptatem iste, id consequuntur eaque labore voluptatibus odio
            neque. Porro ratione nam beatae veniam.
          </p>
          &ensp;
        </div>
        <div className="ml-auto flex gap-4 px-2">
          <button className="icon">notifications</button>
          <button className="icon">group</button>
          <label className="relative block">
            <input
              className="w-48 rounded-md border-none bg-slate-800/60 py-1 pr-10 text-sm text-slate-100 placeholder:text-slate-500 focus:w-64"
              placeholder="Search"
              type="text"
            />
            <span className="icon absolute right-2 top-0 align-middle text-xl">search</span>
          </label>
          <button className="icon">inbox</button>
          <button className="icon">help</button>
        </div>
      </PanelTop>
      <div className="flex grow">
        <main className=" flex grow flex-col">
          <div className="relative flex h-0   grow  flex-col  overflow-y-auto">
            <UnreadMessagesTopNotifier />
            <div className="mt-auto">channles</div>
            <ul className="">
              {messages.map((n, i) => (
                <MessageListItem key={i} />
              ))}
              <DayDivider date={1637483433264} />
              <MessageListItem />
              <NewMessageIndicator />

              <MessageListItem />
              <MessageListItem />
            </ul>
          </div>
          <div className="px-4">
            <MessageSenderForm />
            <div className="flex items-center justify-between">
              <div className="space-x-1">
                <LoadingAnimation />
                <span className="text-sm text-slate-300">Harsha and Arnab are typing...</span>
              </div>
              <div className="text-slate-300">
                <span className="text-sm ">Slowmode is enabled</span>
                <span className="icon text-xl ">timer</span>
              </div>
            </div>
          </div>
        </main>
        <GuildMemberList />
      </div>
    </div>
  )
}

function MessageListItem() {
  return (
    <li className="group mb-2 px-4 py-1 hover:bg-slate-50/5">
      <div className="flex gap-4">
        <UserProfileIcon ringColor="slate-700" />
        <div className="flex flex-col">
          <div className="flex grow items-start justify-between">
            <div className="">
              <span className="text-emerald-400">Username</span>
              <span className="ml-1 text-sm">14/03/2022</span>
            </div>
            <div className="-mt-5 flex h-8 rounded border border-slate-700 bg-slate-600 opacity-0 shadow transition-opacity group-hover:opacity-100">
              <button className="icon px-4 text-slate-300" type="button">
                add_circle
              </button>
            </div>
          </div>
          <p className="break-normal font-sans text-slate-300">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit corporis perferendis
            suscipit alias et, omnis amet, neque debitis commodi molestias odit modi adipisci nihil
            voluptatibus reprehenderit soluta. Repudiandae, ipsum laudantium?
          </p>
        </div>
      </div>
    </li>
  )
}

function DayDivider({ date }: { date: number }) {
  const d = new Date(date)
  return (
    <div className="my-2 flex items-center gap-2 px-4">
      <div className="h-px grow bg-slate-500" />
      <span className="text-xs">
        {d.toLocaleString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </span>
      <div className="h-px grow bg-slate-500" />
    </div>
  )
}

function MessageSenderForm() {
  return (
    <form className="flex h-12 rounded-md bg-slate-500 shadow-md">
      <button className="icon px-4 text-3xl text-slate-300" type="button">
        add_circle
      </button>
      <div className="grow">
        <input
          className="h-full w-full border-none bg-transparent p-0 text-slate-300 placeholder:text-slate-400 focus:outline-none focus:ring-0"
          placeholder="Message in #channel-name"
          type="text"
        />
      </div>
      <div className="flex gap-1"></div>
    </form>
  )
}

function LoadingAnimation() {
  return (
    <span className=" space-x-1">
      <span className="animate-loading inline-block h-2 w-2 rounded-full bg-slate-300" />
      <span className="animate-loading inline-block h-2 w-2 rounded-full bg-slate-300 [animation-delay:150ms]" />
      <span className="animate-loading inline-block h-2 w-2 rounded-full bg-slate-300 [animation-delay:300ms]" />
    </span>
  )
}

function NewMessageIndicator() {
  return (
    <div className="mb-2 flex items-center  px-4">
      <div className="h-px grow bg-rose-500" />
      <div className="h-4 border-8 border-l-0 border-transparent border-r-rose-500" />
      <span className="inline-block rounded-r bg-rose-500 pl-0.5  pr-1 align-bottom text-xs font-semibold  text-slate-200">
        NEW
      </span>
    </div>
  )
}

function UnreadMessagesTopNotifier() {
  return (
    <div className="sticky -top-px z-10 px-4">
      <div className="flex items-center justify-between rounded-b-lg bg-blue-500 px-3 pt-px text-sm text-slate-50 shadow-md">
        <div className="">2 new messages since 2:43pm</div>
        <div className="">
          Mark as Read <span className="icon text-xl">mark_chat_read</span>
        </div>
      </div>
    </div>
  )
}
