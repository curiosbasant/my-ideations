type Common = {
  id: string
  position: number
  name: string
}
export type ServerGroupType = Common & {
  color: string
}
export type ServerType = Common & {
  groupId?: string
}
export type NestedServer = ServerType | (Common & { servers: ServerType[] })

export type ChannelType = Common & {
  serverId: string
  parentId?: string
  locked?: boolean
  type: 'category' | 'text' | 'voice'
}

export type MessageType = {
  serverId?: string
  channelId: string
  content: string
  userId: string
}

/* 

const SERVERS = [
  { type: "server", id: "1" },
  { type: "server", id: "2" },
  { type: "server", id: "3" },
  {
    type: "group",
    id: "4",
    servers: [
      { type: "server", id: "11" },
      { type: "server", id: "12" },
      { type: "server", id: "13" },
      { type: "server", id: "14" },
      { type: "server", id: "15" },
    ],
  },
  { type: "server", id: "5" },
  {
    type: "group",
    id: "4",
    servers: [
      { type: "server", id: "21" },
      { type: "server", id: "22" },
    ],
  },
  { type: "server", id: "6" },
]
type ServerGroup = {
  id: string
  name?: string
  servers: _ServerType[]
  position: number
}
export type _ServerType = {
  id: string
  name: string
  position: number
} & (
  | {
      type: "group"
    }
  | {
      groupId?: string
      type: "server"
    }
)

function sortServers<T>(servers: { position: number }[]) {
  return servers.sort((a, b) => a.position - b.position) as unknown as T
}


function groupServers(allServers: ServerType[]) {
  const gm: (ServerGroup | ServerType)[] = []
  const [groups, servers] = splitArray(allServers, (s) => s.id == "group")
  const groupMap: Record<
    string,
    ServerType | { id: string; servers: ServerType[]; position: number }
  > = {}
  for (const server of servers) {
    // if (server.type == "group") continue
    if (!server.groupId) {
      groupMap[server.id] = server
    } else if (server.groupId in groupMap) {
      // @ts-ignore
      groupMap[server.groupId].servers.push(server)
    } else {
      const group = groups.find((g) => g.id == server.groupId)!
      groupMap[server.groupId] = {
        id: group.id,
        servers: [],
        position: group.position,
      }
    }

    // if ("groupId" in server && server.groupId) {
    //   groupMap[server.groupId] ??= []
    //   groupMap[server.groupId].push(server)
    // } else {
    //   groupMap[server.id] = server
    // }
  }
  const sorted = Object.values(groupMap).sort((a, b) => a.position - b.position)
  for (const server of sorted) {
    if ("servers" in server) {
      server.servers = sortServers(server.servers)
    }
  }
  console.log(sorted, groupMap)
  return sorted
}
*/
