import SERVER_GROUPS from "../data/serverGroups.json"
import SERVERS from "../data/servers.json"
import { NestedServer, ServerGroupType, ServerType } from "../types"

export default function useUser(userId = "123") {
  const servers: ServerType[] = []
  const groups: Record<string, NestedServer> = {}

  for (const ser of SERVERS) {
    if (ser.groupId) {
      const group = SERVER_GROUPS.find((grp) => grp.id == ser.groupId)
      // groups[ser.groupId].push(ser)
      if (group) {
        groups[group.id] ??= { ...group, servers: [], name: group.id }
        // @ts-ignore
        groups[group.id].servers.push(ser)
      }
    } else {
      servers.push(ser)
    }
  }
  for (const grp of Object.values(groups)) {
    // @ts-ignore
    grp.servers.sort((a, b) => a.position - b.position)
  }
  return {
    // serverGroups: <ServerGroupType[]>SERVER_GROUPS,
    servers: [...servers, ...Object.values(groups)].sort((a, b) => a.position - b.position), //: <ServerType[]>SERVERS, //.filter((ch) => ch.serverId == serverId),
  }
}
type hh = Exclude<NestedServer, ServerType>
