"use client"

// Firebase client configuration - simplified version
import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

// Create a dummy implementation for server-side
const dummyFirebase = {
  app: null,
  auth: null,
  db: null,
  storage: null,
  isInitialized: false,
}

// Initialize Firebase only in browser environment
let firebaseInstance = dummyFirebase

try {
  // Only initialize Firebase in the browser
  if (typeof window !== "undefined") {
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
      measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "",
    }

    // Check if any Firebase apps have been initialized
    if (!getApps().length) {
      const app = initializeApp(firebaseConfig)
      const auth = getAuth(app)
      const db = getFirestore(app)
      const storage = getStorage(app)

      firebaseInstance = {
        app,
        auth,
        db,
        storage,
        isInitialized: true,
      }
    } else {
      const app = getApp()
      const auth = getAuth(app)
      const db = getFirestore(app)
      const storage = getStorage(app)

      firebaseInstance = {
        app,
        auth,
        db,
        storage,
        isInitialized: true,
      }
    }
  }
} catch (error) {
  console.error("Error initializing Firebase:", error)
  // Keep the dummy implementation if initialization fails
}

// Export the Firebase instance
export const { app, auth, db, storage } = firebaseInstance

// Helper function to check if Firebase is initialized
export const isFirebaseInitialized = () => firebaseInstance.isInitialized
