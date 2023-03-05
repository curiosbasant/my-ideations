import { getApp, getApps, initializeApp } from 'firebase/app'
import { connectAuthEmulator, getAuth } from 'firebase/auth'
import { connectDatabaseEmulator, getDatabase } from 'firebase/database'
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore'
import { USE_FIREBASE_EMULATORS, __DEV__ } from '~/constants'

if (!getApps().length) {
  const projectId = 'my-ideations'
  const app = initializeApp({
    projectId,
    authDomain: `${projectId}.firebaseapp.com`,
    databaseURL: `https://${projectId}-default-rtdb.asia-southeast1.firebasedatabase.app/`,
    // databaseURL: `https://${projectId}.firebase.io`,

    storageBucket: `${projectId}.appspot.com`,
    appId: '1:790325040832:web:45ddf9b45756e10fa5ff25',
    apiKey: 'AIzaSyBqRG_a7a62Uu5cSO1MByJV3fSPDLCWigo',
    messagingSenderId: '790325040832',
  })

  const auth = getAuth(app),
    firestore = getFirestore(app),
    database = getDatabase(app)

  if (__DEV__ && USE_FIREBASE_EMULATORS) {
    console.info('Dev Env Detected: Using Emulators!')
    const firebaseConfig = require('../../firebase.json')

    if (auth.emulatorConfig?.host !== 'localhost') {
      connectAuthEmulator(auth, `http://localhost:${firebaseConfig.emulators.auth.port}`, {
        disableWarnings: true,
      })
    }

    // @ts-ignore
    if (!firestore._settings?.host.startsWith('localhost')) {
      connectFirestoreEmulator(firestore, 'localhost', firebaseConfig.emulators.firestore.port)
    }

    connectDatabaseEmulator(database, 'localhost', firebaseConfig.emulators.database.port)
  }
}

export const app = getApp(),
  auth = getAuth(app),
  firestore = getFirestore(app),
  database = getDatabase(app)
