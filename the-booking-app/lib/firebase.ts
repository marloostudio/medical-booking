import { initializeApp, getApps, type FirebaseApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getStorage as fbGetStorage } from "firebase/storage"
import { getAuth as fbGetAuth } from "firebase/auth"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// Lazy loading pattern
let app: FirebaseApp
let db: any
let storage: any
let auth: any

// Initialize Firebase only when needed
function getFirebaseApp() {
  if (typeof window !== "undefined") {
    if (!app) {
      if (!getApps().length) {
        app = initializeApp(firebaseConfig)
      } else {
        app = getApps()[0]
      }
    }
    return app
  }
  return null
}

// Get Firestore with lazy initialization
function getDb() {
  if (typeof window !== "undefined") {
    if (!db) {
      const app = getFirebaseApp()
      if (app) {
        db = getFirestore(app)
      }
    }
    return db
  }
  return null
}

// Get Storage with lazy initialization
function getStorage() {
  if (typeof window !== "undefined") {
    if (!storage) {
      const app = getFirebaseApp()
      if (app) {
        storage = fbGetStorage(app)
      }
    }
    return storage
  }
  return null
}

// Get Auth with lazy initialization
function getAuth() {
  if (typeof window !== "undefined") {
    if (!auth) {
      const app = getFirebaseApp()
      if (app) {
        auth = fbGetAuth(app)
      }
    }
    return auth
  }
  return null
}

// Export the original instances for compatibility with existing code
export { getFirebaseApp, getDb as db, getStorage as storage, getAuth as auth }
// Also export the getter functions for new code
export { getFirebaseApp as getApp, getDb, getStorage, getAuth }
