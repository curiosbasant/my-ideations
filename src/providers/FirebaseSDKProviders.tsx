import { app, auth, firestore } from "@/firebase/client"
import nookies from "nookies"
import { useEffect } from "react"
import { AuthProvider, FirebaseAppProvider, FirestoreProvider } from "reactfire"

export default function FirebaseSDKProviders({ children }) {
  useEffect(() => {
    const unsubscriber = auth.onIdTokenChanged(async (user) => {
      if (!user) {
        nookies.set(undefined, "token", "", { path: "/" })
      } else {
        const token = await user.getIdToken()
        nookies.set(undefined, "token", token, { path: "/" })
      }
    })
    const handle = setInterval(async () => {
      if (auth.currentUser) await auth.currentUser.getIdToken(true)
    }, 10 * 60 * 1000)

    return () => {
      clearInterval(handle)
      unsubscriber()
    }
  }, [])

  return (
    <FirebaseAppProvider firebaseApp={app}>
      <AuthProvider sdk={auth}>
        <FirestoreProvider sdk={firestore}>{children}</FirestoreProvider>
      </AuthProvider>
    </FirebaseAppProvider>
  )
}
