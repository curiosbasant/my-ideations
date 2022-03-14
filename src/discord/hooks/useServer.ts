import CHANNELS from "../data/channels.json"
import SERVERS from "../data/servers.json"
import { ChannelType } from "../types"

export default function useServer(serverId = "@me") {
  return {
    channels: <ChannelType[]>CHANNELS.filter((ch) => ch.serverId == serverId),
  }
}
