import { useFunctionalReducer } from "@curiosbasant/react-compooks"
import { Dispatcher } from "@curiosbasant/react-compooks/dist/cjs/types/hooks/useFunctionalReducer"
import { createContext, useContext } from "react"
import CHANNELS from "../data/channels.json"
import SERVER_GROUPS from "../data/serverGroups.json"
import SERVERS from "../data/servers.json"
import { ChannelType, ServerGroupType, ServerType } from "../types"
import { generateRandomId } from "../utils"

const initialState = {
  serverGroups: SERVER_GROUPS as ServerGroupType[],
  servers: SERVERS as ServerType[],
  channels: CHANNELS as ChannelType[],
  showControls: true,
  showTopBanner: false,
  showMembers: true,
  showChannelThread: false,
}
type IState = typeof initialState

const ActionMap = {
  toggleShowingControls(draft: IState) {
    draft.showControls = !draft.showControls
  },
  toggleShowingTopBanner(draft: IState) {
    draft.showTopBanner = !draft.showTopBanner
  },
  toggleShowingMembers(draft: IState) {
    draft.showMembers = !draft.showMembers
    draft.showChannelThread = false
  },
  toggleShowingChannelThread(draft: IState) {
    draft.showMembers = draft.showChannelThread
    draft.showChannelThread = !draft.showChannelThread
  },
  createServer(draft: IState, data: Partial<ServerType>) {
    draft.servers.push({
      id: generateRandomId(),
      name: "no-server-name",
      position: 0,
      ...data,
    })
  },
  moveServer(draft: IState, serverId: string, position: number, groupId?: string) {
    const server = draft.servers.find((ser) => ser.id == serverId)
    if (server) {
      server.position = position
      server.groupId = groupId
    }
  },
  createChannel(draft: IState, data: Partial<ChannelType>) {
    draft.channels.push({
      id: generateRandomId(),
      serverId: "@me",
      name: "no-channel-name",
      position: 0,
      type: "text",
      ...data,
    })
  },
}

export const Context = createContext({
  state: {} as IState,
  dispatch: {} as Dispatcher<typeof ActionMap>,
})

const DiscordProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useFunctionalReducer(ActionMap, initialState)
  return <Context.Provider value={{ state, dispatch }}>{children}</Context.Provider>
}

export const useDiscord = () => useContext(Context)

export default DiscordProvider
