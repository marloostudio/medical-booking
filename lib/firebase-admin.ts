import * as admin from "firebase-admin"

// Check if all required environment variables are present
const requiredEnvVars = ["NEXT_PUBLIC_FIREBASE_PROJECT_ID", "FIREBASE_CLIENT_EMAIL", "FIREBASE_PRIVATE_KEY"]

// Log warning if any required environment variables are missing
requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    console.warn(`Warning: Environment variable ${varName} is not set`)
  }
})

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  // Get the Firebase private key
  const privateKey = process.env.FIREBASE_PRIVATE_KEY
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
    : undefined

  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey,
      }),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    })
    console.log("Firebase Admin initialized successfully")
  } catch (error) {
    console.error("Firebase Admin initialization error:", error)
  }
}

export const db = admin.firestore()
export const auth = admin.auth()
export const storage = admin.storage()
export const adminDb = db
export const adminAuth = auth

export const initializeFirebaseAdmin = () => {
  if (!admin.apps.length) {
    // Get the Firebase private key
    const privateKey = process.env.FIREBASE_PRIVATE_KEY
      ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
      : undefined

    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey,
        }),
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      })
      console.log("Firebase Admin initialized successfully")
    } catch (error) {
      console.error("Firebase Admin initialization error:", error)
    }
  }
}

export default admin
