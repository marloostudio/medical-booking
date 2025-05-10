// Firebase client configuration
import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

// Check if we're in a browser environment
const isBrowser = typeof window !== "undefined"

// Initialize Firebase only in browser environment
const initializeFirebase = () => {
  // Validate required environment variables
  const requiredVars = [
    "NEXT_PUBLIC_FIREBASE_API_KEY",
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  ]

  const missingVars = requiredVars.filter((varName) => !process.env[varName] || process.env[varName] === "undefined")

  if (missingVars.length > 0) {
    console.error(`Missing required Firebase environment variables: ${missingVars.join(", ")}`)
    // Return null values if environment variables are missing
    return {
      app: null,
      auth: null,
      db: null,
      storage: null,
    }
  }

  try {
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
      measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "",
    }

    // Initialize Firebase
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
    const auth = getAuth(app)
    const db = getFirestore(app)
    const storage = getStorage(app)

    return { app, auth, db, storage }
  } catch (error) {
    console.error("Error initializing Firebase:", error)
    // Return null values if initialization fails
    return {
      app: null,
      auth: null,
      db: null,
      storage: null,
    }
  }
}

// Initialize Firebase only in browser environment
const { app, auth, db, storage } = isBrowser ? initializeFirebase() : { app: null, auth: null, db: null, storage: null }

// Helper function to check if Firebase is initialized
export const isFirebaseInitialized = () => {
  return !!app && !!auth && !!db && !!storage
}

export { app, auth, db, storage }
