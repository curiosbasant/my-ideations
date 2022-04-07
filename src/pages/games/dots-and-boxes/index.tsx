import { Page } from "@/components/Page"
import { auth } from "@/firebase/client"
import FirebaseSDKProviders from "@/providers/FirebaseSDKProviders"
import { signInAnonymously, signOut, updateProfile } from "firebase/auth"
import { doc } from "firebase/firestore"
import { NextPage } from "next"
import { useRouter } from "next/router"
import { useFirestore, useFirestoreDocData, useUser } from "reactfire"

class Cell {
  constructor() {}
}

class DotsAndBoxes {
  constructor(readonly rows: number, readonly cols: number) {}
}

const DASH_COLORS = ["bg-yellow-400", "bg-sky-500", "bg-rose-500", "bg-emerald-500"]

const DotsAndBoxesHomePage: NextPage = () => {
  return (
    <Page title="Dots and Boxes">
      <FirebaseSDKProviders>
        <Layout />
      </FirebaseSDKProviders>
    </Page>
  )
}

export default DotsAndBoxesHomePage

function Layout() {
  const { data: user } = useUser()
  const router = useRouter()
  // const firestore = useFirestore()

  async function createGame() {
    if (!user) await signInAnonymously(auth)

    const { gameId } = await fetch("/api/dots-and-boxes?action=make-move", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cols: 5, rows: 4 }),
    }).then((response) => response.json())
    joinGame(gameId)
  }

  function joinGame(gameId: string) {
    router.push(router.pathname + "/" + gameId)
  }

  return (
    <div className="flex h-screen bg-slate-50 text-slate-500">
      <div className="m-auto flex flex-col">
        <button className="" onClick={createGame} type="button">
          Create a Game
        </button>
        <button className="" onClick={() => joinGame} type="button">
          Join Game
        </button>
        <button className="" onClick={() => signOut(auth)} type="button">
          Logout {user ? `(${user.displayName})` : ""}
        </button>
        {user?.displayName}
      </div>
    </div>
  )
}

async function createUser() {
  const { user } = await signInAnonymously(auth)
  console.log(user.uid, user.displayName)

  await updateProfile(user, { displayName: `Guest_${user.uid.slice(0, 6)}` })
  return user
}
