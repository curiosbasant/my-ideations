import { ServiceAccount, cert, getApp, getApps, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getDatabase } from 'firebase-admin/database'
import { getFirestore } from 'firebase-admin/firestore'

if (!getApps().length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT ?? '')
  serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n')

  initializeApp({
    credential: cert(serviceAccount as ServiceAccount),
    databaseURL: `https://${serviceAccount.project_id}-default-rtdb.asia-southeast1.firebasedatabase.app`,
  })
}

export const app = getApp()

export const auth = getAuth(app)

/* Firestore exports */
export const firestore = getFirestore(app)
export { FieldValue, Timestamp } from 'firebase-admin/firestore'

export const database = getDatabase(app)

export const collections = {
  dotsAndBoxes: firestore.collection('dots-and-boxes'),
  users: firestore.collection('users'),
}

export const APPS = {
  discord: firestore.doc('apps/discord'),
  shadyantra: firestore.doc('apps/shadyantra'),
  quizApp: firestore.doc('apps/quizApp'),
  games: firestore.doc('apps/games'),
}
