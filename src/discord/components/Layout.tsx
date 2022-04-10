import { useToggle } from "@curiosbasant/react-compooks"
import { Page } from "components/Page"
import { useState } from "react"
import useChannel from "../hooks/useChannel"
import useServer from "../hooks/useServer"
import useUser from "../hooks/useUser"
import { useDiscord } from "../providers/DiscordProvider"
import ChannelMessageList from "./ChannelMessageList"
import DMList from "./DMList"
import FriendsList from "./FriendsList"
import GuildChannelList from "./GuildChannelList"
import ServerList from "./ServerList"
import ThreadChannelSide from "./ThreadChannelSide"

export type LayoutProps = {
  userId: string
  serverId: string
  channelId?: string
  enableControls?: boolean
}
export default function Layout({
  userId,
  serverId,
  channelId = "welcome",
  enableControls,
}: LayoutProps) {
  const { state, dispatch } = useDiscord()
  const user = useUser(userId)
  const server = useServer(serverId)
  const channel = server.channels.find((ch) => ch.id == channelId) ?? server.channels[0]

  return (
    <Page title="Discord Clone">
      <div className="flex h-screen overflow-hidden text-slate-400">
        <ServerList
          servers={user.servers}
          activeServerId={serverId}
          createNewServer={(name) => dispatch.createServer({ name })}
        />

        <div className="flex grow flex-col">
          {state.showTopBanner && (
            <div className="-mb-4  bg-yellow-400 pb-4">
              <p className="p-2 text-slate-600">
                This is some notification which is important to give you!
              </p>
            </div>
          )}
          <div
            className={`flex grow gap-2 overflow-hidden ${
              state.showTopBanner ? "rounded-t-xl" : ""
            } bg-slate-800 only:rounded-none`}>
            <div
              className={`flex grow overflow-hidden ${
                state.showChannelThread ? "rounded-r-xl" : ""
              }`}>
              {serverId == "@me" ? (
                <>
                  <DMList channels={server.channels} activeChannelId={channelId} />
                  <FriendsList />
                </>
              ) : server.data ? (
                <>
                  <GuildChannelList
                    server={server.data}
                    channels={server.channels}
                    activeChannelId={channelId}
                    createNewChannel={server.addChannel}
                  />
                  {channel && <ChannelMessageList channel={channel} messages={[...Array(8)]} />}
                </>
              ) : (
                <p className="">No server found</p>
              )}
            </div>
            {state.showChannelThread && <ThreadChannelSide />}
          </div>
          {enableControls && <Controls />}
        </div>
      </div>
    </Page>
  )
}

function Controls() {
  const { state, dispatch } = useDiscord()

  return (
    <div
      className={`relative ${
        state.showControls ? "max-h-32" : "max-h-0"
      } bg-slate-500 transition-all`}>
      <button
        className="icon absolute bottom-full left-1/2 rounded-t-full border border-slate-800 bg-slate-700 px-4 pt-1 leading-none"
        onClick={dispatch.toggleShowingControls}
        type="button">
        {state.showControls ? "expand_more" : "expand_less"}
      </button>
      <div className="border-t py-4 px-8 text-slate-200">
        <label className="">
          Show Top Banner{" "}
          <input
            className="h-5 w-5 rounded shadow-inner"
            checked={state.showTopBanner}
            onChange={dispatch.toggleShowingTopBanner}
            type="checkbox"
          />
        </label>
        <label className="">
          Show Channel Thread{" "}
          <input
            className="h-5 w-5 rounded shadow-inner"
            checked={state.showChannelThread}
            onChange={dispatch.toggleShowingChannelThread}
            type="checkbox"
          />
        </label>
      </div>
    </div>
  )
}
