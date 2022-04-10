import CHANNELS from "../data/channels.json"
import SERVERS from "../data/servers.json"
import { useDiscord } from "../providers/DiscordProvider"
import { ChannelType, ServerType } from "../types"

export default function useServer(serverId = "@me") {
  const { state, dispatch } = useDiscord()
  // const server = (<ServerType[]>SERVERS).find((ser) => ser.id == serverId)
  const server = state.servers.find((ser) => ser.id == serverId)
  return {
    data: server ?? null,
    channels: state.channels.filter((ch) => ch.serverId == serverId),
    addChannel(name: string) {
      dispatch.createChannel({ serverId, name })
    },
  }
}
// (<ChannelType[]>CHANNELS)
