import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"
import { getAuth } from "firebase-admin/auth"

// Initialize Firebase Admin SDK
const firebaseAdminConfig = {
  credential: cert({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
  databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com`,
}

// Initialize the app only if it hasn't been initialized already
const apps = getApps()
const firebaseAdmin = apps.length === 0 ? initializeApp(firebaseAdminConfig) : apps[0]

// Get Firestore and Auth instances
const adminDb = getFirestore()
const adminAuth = getAuth()

export { firebaseAdmin, adminDb, adminAuth }
