import { Page } from "components/Page"
import { useState } from "react"
import useChannel from "../hooks/useChannel"
import useServer from "../hooks/useServer"
import useUser from "../hooks/useUser"
import ChannelMessageList from "./ChannelMessageList"
import DMList from "./DMList"
import FriendsList from "./FriendsList"
import GuildChannelList from "./GuildChannelList"
import ServerList from "./ServerList"

export default function Layout({
  userId,
  serverId,
  channelId = "welcome",
}: {
  userId: string
  serverId: string
  channelId?: string
}) {
  const user = useUser(userId)
  const server = useServer(serverId)
  const channel = server.channels.find((ch) => ch.id == channelId) ?? server.channels[0]
  console.log(channel)

  return (
    <Page title="Discord Clone">
      <div className="flex h-screen overflow-hidden text-slate-400">
        <ServerList servers={user.servers} activeServerId={serverId} />

        <div className="flex grow flex-col">
          {false && (
            <div className="-mb-4  bg-yellow-400 pb-4">
              <p className="p-2 text-slate-600">
                This is some notification which is important to give you!
              </p>
            </div>
          )}
          <div className="flex grow gap-2 overflow-hidden rounded-t-xl bg-slate-800 only:rounded-none">
            <div className="flex grow overflow-hidden rounded-r-xl only:rounded-none">
              {serverId == "@me" ? (
                <>
                  <DMList channels={server.channels} activeChannelId={channelId} />
                  <FriendsList />
                </>
              ) : (
                <>
                  <GuildChannelList channels={server.channels} activeChannelId={channelId} />
                  {channel && <ChannelMessageList channel={channel} messages={[...Array(8)]} />}
                </>
              )}
            </div>
            {false && <div className="shrink-0 basis-1/5 rounded-l-xl bg-slate-600"></div>}
          </div>
        </div>
      </div>
    </Page>
  )
}
