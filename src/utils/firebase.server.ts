import { cert, getApp, getApps, initializeApp, ServiceAccount } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getDatabase } from 'firebase-admin/database'
import { getFirestore } from 'firebase-admin/firestore'
import serviceAccount from '../service-account.json'

if (!getApps().length) {
  console.log(
    serviceAccount.project_id,
    process.env.FIRESTORE_EMULATOR_HOST,
    process.env.FIREBASE_DATABASE_EMULATOR_HOST
  )
  // const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT ?? '')
  // serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n')
  initializeApp({
    // projectId: 'demo-ideations',
    projectId: serviceAccount.project_id,
    databaseURL: `https://${serviceAccount.project_id}.firebase.io`,
    // databaseURL: `https://${serviceAccount.project_id}.firebase.io`,
    // databaseURL: `http://localhost:8030/?ns=${serviceAccount.project_id}`,
    // databaseURL: `https://${serviceAccount.project_id}-default-rtdb.asia-southeast1.firebasedatabase.app`,
    // credential: cert(serviceAccount as ServiceAccount),
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
