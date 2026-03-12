import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBieoyEdnvh3l3Or1WSREHLbG72hwYmYaA",
  authDomain: "eventsmap-d4fe8.firebaseapp.com",
  projectId: "eventsmap-d4fe8",
  storageBucket: "eventsmap-d4fe8.firebasestorage.app",
  messagingSenderId: "759946757613",
  appId: "1:759946757613:web:8a41e91e31b934080d53e4",
  measurementId: "G-LHVEPJDKLC"
}

// Guard against double-initialization (Vite HMR)
const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()

export const firebaseAuth = getAuth(firebaseApp)
export const firestore    = getFirestore(firebaseApp)

export default firebaseApp
