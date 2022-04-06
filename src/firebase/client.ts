import { __DEV__ } from "@/constants"
import { getApp, getApps, initializeApp } from "firebase/app"
import { connectAuthEmulator, getAuth } from "firebase/auth"
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore"

if (!getApps().length) {
  const projectId = "my-ideations"
  const app = initializeApp({
    projectId,
    authDomain: `${projectId}.firebaseapp.com`,
    storageBucket: `${projectId}.appspot.com`,
    apiKey: "AIzaSyBqRG_a7a62Uu5cSO1MByJV3fSPDLCWigo",
    messagingSenderId: "790325040832",
    appId: "1:790325040832:web:45ddf9b45756e10fa5ff25",
  })

  const auth = getAuth(app),
    firestore = getFirestore(app)

  if (typeof window != "undefined" && __DEV__) {
    console.info("Dev Env Detected: Using Emulators!")
    const firebaseConfig = require("../../firebase.json")
    if (auth.emulatorConfig?.host !== "localhost") {
      connectAuthEmulator(auth, `http://localhost:${firebaseConfig.emulators.auth.port}`, {
        disableWarnings: true,
      })
    }

    // @ts-ignore
    if (!firestore._settings?.host.startsWith("localhost")) {
      connectFirestoreEmulator(firestore, "localhost", firebaseConfig.emulators.firestore.port)
    }
  }
}

export const app = getApp()
export const auth = getAuth(app)
export const firestore = getFirestore(app)
