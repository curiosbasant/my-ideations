import { cert, getApp, getApps, initializeApp, ServiceAccount } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"
import serviceAccount from "./service-account.json"

if (!getApps().length) {
  initializeApp({
    projectId: serviceAccount.project_id,
    credential: cert(serviceAccount as ServiceAccount),
  })
}

export const app = getApp()

export const auth = getAuth()

/* Firestore exports */
export const firestore = getFirestore()
export { FieldValue, Timestamp } from "firebase-admin/firestore"

export const collections = {
  dotsAndBoxes: firestore.collection("dots-and-boxes"),
  users: firestore.collection("users"),
}
