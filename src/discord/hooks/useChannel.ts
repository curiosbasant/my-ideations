import CHANNELS from '../data/channels.json'
import SERVERS from '../data/servers.json'
import { ChannelType } from '../types'

export default function useChannel(channelId: string) {
  return {
    data: CHANNELS.find((ch) => ch.id == channelId) as ChannelType,
    messages: [],
    // channels: CHANNELS.filter((ch) => ch.serverId == channelId),
  }
}
