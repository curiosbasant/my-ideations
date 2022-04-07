import { Page } from "@/components/Page"
import FirebaseSDKProviders from "@/providers/FirebaseSDKProviders"
import { signInAnonymously } from "firebase/auth"
import { doc } from "firebase/firestore"
import { NextPage } from "next"
import { useRouter } from "next/router"
import { useEffect } from "react"
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
  const {
    data: game,
    status,
    error,
  } = useFirestoreDocData(doc(firestore, "dots-and-boxes", gameId))

  useEffect(() => {
    if (!game) return
    if (
      game.players.length < 4 &&
      !game.players.includes(user?.uid) &&
      confirm("Do you want to join in?")
    ) {
      joinGame()
    }
  }, [status])

  if (status != "success") return <p className="">"Loading..."</p>
  if (!game) return <p>Doc dont exist</p>

  const isOP = Boolean(user) && game.players[0] == user!.uid
  const myTurn =
    Boolean(user) && game.status == "started" && game.players[game.activePlayer] == user!.uid

  const toggleDash = (name: string) => async () => {
    const data = await fetch("/api/dots-and-boxes?action=make-move", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameId, dash: name }),
    }).then((response) => response.json())
    console.log(data)
  }

  async function joinGame() {
    if (!user) await signInAnonymously(auth)
    const data = await fetch("/api/dots-and-boxes?action=join-game", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameId }),
    }).then((response) => response.json())
    console.log(data)
  }

  return (
    <div className="h-screen overflow-y-auto bg-slate-50 text-slate-500">
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
            {game.players.map((id, i) => {
              return (
                <PlayerListItem
                  index={i + 1}
                  display={id}
                  me={user?.uid == id}
                  myTurn={game.players[game.activePlayer] == id}
                  count={Object.values(game.boxes).reduce<number>(
                    (counter, pos) => counter + +(pos == i + 1),
                    0
                  )}
                  color={DASH_COLORS[i]}
                  showRemoveButton={isOP}
                  key={id}
                />
              )
            })}
          </ul>
          <div className="flex flex-col items-center">
            {game.status == "waiting" &&
              (isOP ? (
                <button
                  className="rounded-md bg-emerald-500 px-4 py-2 text-slate-50 transition-colors hover:bg-emerald-400 disabled:bg-slate-400"
                  onClick={async () => {
                    const data = await fetch("/api/dots-and-boxes?action=start-game", {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ gameId }),
                    }).then((response) => response.json())
                    console.log(data)
                  }}
                  disabled={game.players.length < 2}>
                  Start Game
                </button>
              ) : (
                <p className="">
                  <span className="inline-block animate-spin rounded-full border-2 border-y-slate-500 border-x-transparent p-1.5 align-middle"></span>{" "}
                  Waiting for players to join...
                </p>
              ))}
          </div>
        </section>
      </div>
    </div>
  )
}

function Dash({ r = 0, c = 0, colorClass = "", setColor, vert = false }) {
  return (
    <div
      className="pointer-events-none absolute h-full w-full"
      style={{ transform: `translate(${c}00%,${r}00%) rotate(${-vert * 90}deg)` }}>
      <div
        className={`befter:absolute befter:pointer-events-none befter:top-0 befter:block befter:rounded-full hover:befter:z-50 befter:bg-slate-500 befter:p-2 befter:ring-offset-2 hover:befter:ring-2 pointer-events-auto relative h-4 -translate-y-1/2 ${
          setColor ? "cursor-pointer" : ""
        } rounded-full bg-clip-content py-1 transition-colors before:-left-2 after:-right-2 hover:z-50 ${
          colorClass || "text-slate-200/50 hover:text-slate-300/75"
        } bg-current`}
        onClick={setColor}></div>
    </div>
  )
}

function PlayerListItem({
  me = false,
  myTurn = false,
  index = 0,
  display = "",
  color = "",
  count = 0,
  showRemoveButton = false,
}) {
  return (
    <li
      className={`group ${
        myTurn ? "bg-current font-semibold" : ""
      } ${color} rounded-md px-4 py-2 transition-colors delay-150`}>
      <div className={`flex justify-between ${myTurn ? "text-slate-50" : ""}`}>
        <span className="block">
          {index}. {me ? "You" : display} ({count})
        </span>
        {index > 1 && showRemoveButton && (
          <button className="icon text-xl opacity-0 transition-opacity group-hover:opacity-100">
            close
          </button>
        )}
        {me && <button className="icon text-xl">edit</button>}
      </div>
    </li>
  )
}

function traverse<T>(R: number, C: number, callback: (r: number, c: number) => T) {
  return [...Array(R)].flatMap((_, r) => [...Array(C)].map((_, c) => callback(r, c)))
}
