import ActivityList from "./ActivityList"
import PanelTop from "./PanelTop"
import UserProfileIcon from "./UserProfileIcon"

export default function FriendsList({}) {
  return (
    <div className="flex grow flex-col bg-slate-600">
      <PanelTop>
        <>
          <div className="flex items-center divide-x divide-slate-500/75">
            <div className="whitespace-nowrap pr-4 text-slate-300">
              <span className="icon px-2 text-3xl leading-none">person</span>
              <span className="align-middle font-bold">Friends</span>
            </div>
            <nav className="shrink-0 px-4">
              <ul className="flex gap-4">
                {["Online", "All", "Pending", "Blocked"].map((n, i) => (
                  <li className="" key={i}>
                    <button
                      className={`inline-block rounded px-2 py-0 ${
                        !i ? "bg-slate-50/10 text-slate-300 shadow" : "hover:bg-slate-50/5"
                      }`}>
                      {n}
                    </button>
                  </li>
                ))}
                <li className="">
                  <button className="inline-block rounded bg-green-600 px-2 py-0 text-slate-200 shadow">
                    Add Friend
                  </button>
                </li>
              </ul>
            </nav>
          </div>
          <div className="ml-auto flex shrink-0 items-center divide-x divide-slate-500/75">
            <div className="px-4">
              <span className="icon text-3xl leading-none">add_comment</span>
            </div>
            <div className="space-x-4 px-4">
              <span className="icon text-3xl leading-none">chat</span>
              <span className="icon text-3xl leading-none">help</span>
            </div>
          </div>
        </>
      </PanelTop>
      <div className="flex grow divide-x divide-slate-500/75">
        <main className="grow py-4 px-8">
          <div className="">
            <label className="relative block">
              <input
                className="h-10 w-full rounded-md border-none bg-slate-800/60 pr-10 text-slate-100 placeholder:text-slate-500"
                placeholder="Search"
                type="text"
              />
              <span className="icon absolute right-2 top-2 align-middle">search</span>
            </label>
          </div>
          <div className="py-4 text-sm uppercase tracking-wide">Online - 6</div>
          <div className="grow overflow-y-auto">
            <ul className="">
              {[...Array(10)].map((n, i) => (
                <FriendListItem key={i} />
              ))}
            </ul>
          </div>
        </main>
        <ActivityList />
      </div>
    </div>
  )
}
function _FriendsList({}) {
  return (
    <main className="flex h-full grow flex-col bg-slate-600 ">
      <div className="shrink-0 basis-12 border-b border-slate-800/50 p-2 shadow">
        <header className="flex items-center justify-between ">
          <div className=""></div>
        </header>
      </div>
      <div className="flex h-full grow divide-x divide-slate-500/75 overflow-y-hidden">
        <div className="grow py-4 px-8">
          <div className="flex flex-col">
            <div className="py-4 text-sm uppercase tracking-wide">Online - 6</div>
            <div className="grow overflow-y-auto">
              <ul className="">
                {[...Array(10)].map((n, i) => (
                  <FriendListItem key={i} />
                ))}
              </ul>
            </div>
          </div>
        </div>
        <ActivityList />
      </div>
    </main>
  )
}

function FriendListItem() {
  return (
    <li className="group border-t border-slate-500/75 py-3 px-2 hover:relative hover:-mb-px hover:rounded-md hover:border-none hover:bg-slate-50/5">
      <div className="flex gap-4">
        <UserProfileIcon presence="online" ringColor="slate-600" />
        <div className="flex grow flex-col justify-evenly">
          <div className="">
            <span className="font-bold text-slate-300">Chieftus</span>
            <span className="text-sm  opacity-0 transition-opacity group-hover:opacity-100">
              #3472
            </span>
          </div>
          <div className="">
            <p className="text-sm">You can be wrong half the time, and still make a fortune</p>
          </div>
        </div>
        <div className="space-x-2">
          <button className="h-10 w-10 rounded-full bg-slate-700 bg-opacity-75 group-hover:bg-opacity-100">
            <span className="icon">message</span>
          </button>
          <button className="h-10 w-10 rounded-full bg-slate-700 bg-opacity-75 group-hover:bg-opacity-100">
            <span className="icon">more_vert</span>
          </button>
        </div>
      </div>
    </li>
  )
}
