import { initializeApp } from 'firebase/app'
import { getAuth, setPersistence, browserLocalPersistence, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyAlvwV6tQMdLGAYnGZsMxwIW5B8cYdiKNY",
  authDomain: "obelisk-ca117.firebaseapp.com",
  projectId: "obelisk-ca117",
  storageBucket: "obelisk-ca117.firebasestorage.app",
  messagingSenderId: "574365252836",
  appId: "1:574365252836:web:f8c21cc4cb1bdcd46480f1",
  measurementId: "G-D0P8QL36G8"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const googleProvider = new GoogleAuthProvider()

setPersistence(auth, browserLocalPersistence).catch(console.error)

export default app
