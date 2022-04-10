import Dialog from "@/components/overlays/Dialog"
import Page from "@/components/Page"
import FirebaseSDKProviders from "@/providers/FirebaseSDKProviders"
import { useEffectOnce } from "@curiosbasant/react-compooks"
import Axios from "axios"
import { signInAnonymously } from "firebase/auth"
import { doc } from "firebase/firestore"
import { NextPage } from "next"
import { useRouter } from "next/router"
import nookies from "nookies"
import { useState } from "react"
import { useAuth, useFirestore, useFirestoreDocData, useUser } from "reactfire"

// export const getServerSideProps: GetServerSideProps = async ({ req, res, query }) => {
//   // const gameId = query.gameId as string
//   // let userId = ""
//   // try {
//   //   const user = await auth.verifyIdToken(req.cookies.token)
//   //   userId = user.uid
//   // } catch (error) {
//   //   const user = await auth.createUser({})
//   //   auth.updateUser(user.uid, { displayName: `Guest_${user.uid.slice(0, 6)}` })
//   //   const token = await auth.createCustomToken(user.uid)
//   //   userId = user.uid
//   // }

//   // await joinGame(gameId, userId)

//   return {
//     props: {},
//   }
// }

const DASH_COLORS = ["text-sky-500", "text-orange-500", "text-emerald-500", "text-violet-500"]

const DotsAndBoxesGamePage: NextPage = () => {
  const router = useRouter()
  return (
    <Page title="Dots and Boxes">
      <FirebaseSDKProviders>
        {router.query.gameId && <Layout gameId={router.query.gameId as string} />}
      </FirebaseSDKProviders>
    </Page>
  )
}

export default DotsAndBoxesGamePage

function Layout({ gameId = "" }) {
  const auth = useAuth()
  const { data: user } = useUser()
  const firestore = useFirestore()
  const { data: game, status } = useFirestoreDocData(doc(firestore, "dots-and-boxes", gameId))
  const [error, setError] = useState("")

  useEffectOnce(() => {
    nookies.set(undefined, "gameId", gameId, { path: "/" })
    return () => {
      nookies.destroy(undefined, "gameId")
    }
  })

  if (status != "success") return <p className="">"Loading..."</p>
  if (!game) return <p>Doc dont exist</p>

  const isOP = Boolean(user) && game.players[0].id == user!.uid
  const myTurn =
    Boolean(user) && game.status == "started" && game.players[game.activePlayer].id == user!.uid

  const toggleDash = (name: string) => async () => {
    try {
      const { data } = await Axios.patch("/api/dots-and-boxes?action=make-move", { dash: name })
    } catch (error: any) {
      setError(error.code)
    }

    // console.log(data)
  }

  async function handleStartingGame() {
    const { data } = await Axios.patch("/api/dots-and-boxes?action=start-game")
    console.log(data)
  }

  async function handleJoiningGame() {
    if (!user) await signInAnonymously(auth)
    const { data } = await Axios.patch("/api/dots-and-boxes?action=join-game")
    // console.log(data)
  }

  return (
    <div className="h-screen overflow-y-auto">
      <div className="mx-auto flex h-full w-full max-w-7xl flex-col gap-x-8 px-4 lg:flex-row xl:px-0">
        <section className="relative my-4 grow">
          <div
            className="grid"
            style={{ gridTemplateColumns: `repeat(${game.config.cols}, minmax(0, 1fr))` }}>
            {[...Array(game.config.rows * game.config.cols)].map((n, i) => (
              <div className="flex  aspect-square " key={i}>
                <span className="m-auto font-semibold sm:text-xl md:text-3xl ">
                  {game.boxes[i]}
                </span>
              </div>
            ))}
          </div>
          <div
            className="absolute top-0 aspect-square"
            style={{ width: 100 / game.config.cols + "%" }}>
            {traverse(game.config.rows + 1, game.config.cols, (r: number, c: number) => {
              const name = `${r * (game.config.cols + 1) + c}_${r * (game.config.cols + 1) + c + 1}`
              return (
                <Dash
                  {...{ r, c }}
                  highlighted={game.lastDash == name}
                  colorClass={DASH_COLORS[game.dashes[name]]}
                  setColor={myTurn ? toggleDash(name) : undefined}
                  key={r + "_" + c}
                />
              )
            })}
            {traverse(game.config.rows, game.config.cols + 1, (r: number, c: number) => {
              const name = `${r * (game.config.cols + 1) + c}_${
                (r + 1) * (game.config.cols + 1) + c
              }`
              return (
                <Dash
                  {...{ r, c }}
                  highlighted={game.lastDash == name}
                  colorClass={DASH_COLORS[game.dashes[name]]}
                  setColor={myTurn ? toggleDash(name) : undefined}
                  vert
                  key={r + "_" + c}
                />
              )
            })}
          </div>
        </section>
        <section className="shrink-0 basis-full py-4 lg:max-w-sm">
          <span className="text-2xl font-bold">Players</span>
          <ul className="my-4 ">
            {game.players.map((p, i) => {
              return (
                <PlayerListItem
                  position={i + 1}
                  player={p}
                  me={user?.uid == p.id}
                  myTurn={game.players[game.activePlayer].id == p.id}
                  count={Object.values(game.boxes).reduce<number>(
                    (counter, pos) => counter + +(pos == i + 1),
                    0
                  )}
                  color={DASH_COLORS[i]}
                  showKickButton={isOP}
                  key={p.id}
                />
              )
            })}
          </ul>
          <div className="flex flex-col items-center">
            {game.status == "waiting" &&
              (isOP ? (
                <button
                  className="rounded-md bg-emerald-500 px-4 py-2 text-slate-50 transition-colors hover:bg-emerald-400 disabled:bg-slate-400"
                  onClick={handleStartingGame}
                  disabled={game.players.length < 2}>
                  Start Game
                </button>
              ) : (
                game.players.length < 4 && (
                  <>
                    <p className="">
                      <span className="inline-block animate-spin rounded-full border-2 border-y-slate-500 border-x-transparent p-1.5 align-middle"></span>
                      Waiting for players to join...
                    </p>
                    {!game.players.some((p) => p.id == user?.uid) && (
                      <button
                        className="mt-4 rounded-md bg-emerald-500 px-4 py-2 text-slate-50 transition-colors hover:bg-emerald-400 "
                        onClick={handleJoiningGame}>
                        Join Game
                      </button>
                    )}
                  </>
                )
              ))}
            {error && <p className="text-red-500">{error}</p>}
            {user?.uid}
          </div>
        </section>
      </div>
    </div>
  )
}

function Dash({ r = 0, c = 0, colorClass = "", setColor, highlighted = false, vert = false }) {
  return (
    <div
      className="pointer-events-none absolute h-full w-full"
      style={{ transform: `translate(${c}00%,${r}00%) rotate(${-vert * 90}deg)` }}>
      <div
        className={`befter:absolute befter:pointer-events-none befter:top-0 befter:block befter:rounded-full hover:befter:z-50 befter:bg-slate-500 befter:p-2 befter:ring-offset-2 ${
          highlighted ? "befter:ring-4" : "hover:befter:ring-2"
        } pointer-events-auto relative h-4 -translate-y-1/2 ${
          setColor ? "cursor-pointer" : ""
        } rounded-full bg-clip-content py-1 transition-colors before:-left-2 after:-right-2 hover:z-50 ${
          colorClass || "text-slate-200/50 hover:text-slate-300/75"
        } bg-current`}
        onClick={setColor}></div>
    </div>
  )
}

type PlayerListItemProps = {
  me?: boolean
  myTurn?: boolean
  position: number
  color?: string
  count?: number
  player: { id: string; display: string }
  showKickButton?: boolean
}
function PlayerListItem({
  me = false,
  myTurn = false,
  position,
  color = "",
  count = 0,
  player,
  showKickButton = false,
}: PlayerListItemProps) {
  function handleKickingPlayer() {
    Axios.patch("/api/dots-and-boxes?action=kick-player", { playerId: player.id })
  }

  return (
    <li
      className={`group ${
        myTurn ? "bg-current font-semibold" : ""
      } ${color} rounded-md px-4 py-2 transition-colors delay-150`}>
      <div className={`flex justify-between ${myTurn ? "text-slate-50" : ""}`}>
        <span className="block">
          {position}. {me ? "You" : player.display} ({count})
        </span>
        {position > 1 && showKickButton && (
          <button
            className="icon text-xl opacity-0 transition-opacity group-hover:opacity-100"
            onClick={handleKickingPlayer}>
            close
          </button>
        )}
        {me && <EditNameDialog currentName={player.display} />}
      </div>
    </li>
  )
}

function traverse<T>(R: number, C: number, callback: (r: number, c: number) => T) {
  return [...Array(R)].flatMap((_, r) => [...Array(C)].map((_, c) => callback(r, c)))
}

function EditNameDialog({ currentName = "" }) {
  const [error, setError] = useState("")
  function handleEditingName(newName: string) {
    Axios.patch("/api/dots-and-boxes?action=edit-player-name", { newName }).catch((reason) =>
      setError(reason.message)
    )
  }

  return (
    <Dialog title="Edit your Display Name" button={<span className="icon text-xl">edit</span>}>
      {({ initialFocusRef, closeDialog }) => (
        <form
          className="grid grid-cols-2 gap-4"
          onSubmit={(ev) => {
            ev.preventDefault()
            const formData = new FormData(ev.currentTarget)
            // ev.currentTarget.elements.namedItem("displayName")
            // handleEditingName(formData.get("displayName") as string)
            closeDialog()
          }}>
          <div className="col-span-2">
            <input
              ref={initialFocusRef}
              className="w-full rounded-md border-slate-300 bg-slate-50 shadow-inner"
              defaultValue={currentName}
              name="displayName"
              type="text"
            />
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
          </div>
          <button className="rounded-md bg-emerald-500 px-4 py-2 text-slate-50">Save</button>
          <button
            className="rounded-md bg-slate-500 px-4 py-2 text-slate-50"
            onClick={closeDialog}
            type="button">
            Cancel
          </button>
        </form>
      )}
    </Dialog>
  )
}
