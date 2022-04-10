import Dialog from "@/components/overlays/Dialog"
import Page from "@/components/Page"
import { auth } from "@/firebase/client"
import FirebaseSDKProviders from "@/providers/FirebaseSDKProviders"
import Axios from "axios"
import { signInAnonymously, signOut, updateProfile } from "firebase/auth"
import { NextPage } from "next"
import { useRouter } from "next/router"
import { useState } from "react"
import { useUser } from "reactfire"

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

  function joinGame(gameId: string) {
    router.push(router.pathname + "/" + gameId)
  }

  return (
    <div className="flex h-screen bg-slate-50 text-slate-500">
      <div className="m-auto flex flex-col">
        <CreateNewGameModal />

        <button className="" onClick={() => joinGame} type="button">
          Join Game
        </button>
        <button className="" onClick={() => signOut(auth)} type="button">
          Logout
        </button>
        {user?.uid}
      </div>
    </div>
  )
}

function CreateNewGameModal() {
  const { data: user } = useUser()
  const [error, setError] = useState("")
  const router = useRouter()

  async function handleSubmit() {
    if (!user) await signInAnonymously(auth)

    // try {
    //   const { data } = await Axios.post<any, any>("/api/dots-and-boxes?action=make-move", {
    //     cols,
    //     rows,
    //   })
    //   router.push(router.pathname + "/" + data.qgameId)
    //   console.log(data)
    // } catch (error: any) {
    //   setError(error.message)
    // }
    // // joinGame(data.gameId)
  }
  return (
    <Dialog title="Create New Game" button={<span className=" text-xl">Create a Game</span>}>
      {({ initialFocusRef, closeDialog }) => (
        <form
          action="/api/dots-and-boxes"
          about="Creating"
          className="flex flex-col gap-4"
          onSubmit={async (ev) => {
            ev.preventDefault()
            const form = ev.currentTarget
            // const formData = new FormData(ev.currentTarget)
            // createGame(+formData.get("rows")!, +formData.get("cols")!)
            // alert("sub")
            await handleSubmit()
            form.submit()
          }}
          method="POST">
          <fieldset className="flex gap-4">
            <label className="block">
              <span className="">Rows</span>
              <input
                ref={initialFocusRef}
                className="w-full rounded-md border-slate-300 bg-slate-100 shadow-inner"
                defaultValue={7}
                name="rows"
                type="number"
              />
            </label>
            <label className="block">
              <span className="">Cols</span>
              <input
                className="w-full rounded-md border-slate-300 bg-slate-100 shadow-inner"
                defaultValue={10}
                name="cols"
                type="number"
              />
            </label>
          </fieldset>
          <div className="col-span-2">
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
          </div>
          <button className="rounded-md bg-emerald-500 px-4 py-2 text-slate-50">Create</button>
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
