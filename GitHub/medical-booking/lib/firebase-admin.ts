import { getApps, initializeApp, cert, getApp } from "firebase-admin/app"
import { getFirestore, type Firestore } from "firebase-admin/firestore"
import { getAuth, type Auth } from "firebase-admin/auth"

/**
 * Formats the Firebase private key to ensure it has proper PEM format
 */
function formatPrivateKey(key: string | undefined): string | undefined {
  if (!key) return undefined

  // If the key already contains actual newlines, it's already formatted correctly
  if (key.includes("\n") && key.startsWith("-----BEGIN PRIVATE KEY-----")) {
    return key
  }

  // If the key has escaped newlines (\n), replace them with actual newlines
  if (key.includes("\\n")) {
    return key.replace(/\\n/g, "\n")
  }

  return key
}

/**
 * Singleton pattern for Firebase Admin initialization
 */
function getFirebaseAdmin(): { db: Firestore; auth: Auth } {
  try {
    // Check if Firebase Admin is already initialized
    const apps = getApps()

    if (apps.length > 0) {
      // If already initialized, return the existing app
      const app = getApp()
      return {
        db: getFirestore(app),
        auth: getAuth(app),
      }
    }

    // Get environment variables
    const projectId = process.env.GCLOUD_PROJECT || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
    const privateKey = formatPrivateKey(process.env.FIREBASE_PRIVATE_KEY)

    // Validate required credentials
    if (!projectId || !clientEmail || !privateKey) {
      throw new Error(
        `Firebase Admin initialization failed. Missing required credentials:
        ${!projectId ? "GCLOUD_PROJECT or NEXT_PUBLIC_FIREBASE_PROJECT_ID" : ""}
        ${!clientEmail ? "FIREBASE_CLIENT_EMAIL" : ""}
        ${!privateKey ? "FIREBASE_PRIVATE_KEY" : ""}`,
      )
    }

    // Initialize Firebase Admin
    const app = initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    })

    console.log("Firebase Admin initialized successfully")

    return {
      db: getFirestore(app),
      auth: getAuth(app),
    }
  } catch (error) {
    console.error("Firebase Admin initialization error:", error)
    throw error
  }
}

// Export the Firebase Admin instances
export const { db: adminDb, auth: adminAuth } = getFirebaseAdmin()

/**
 * Helper function to get a Firestore collection reference
 */
export function getCollection(collectionPath: string) {
  return adminDb.collection(collectionPath)
}

/**
 * Helper function to get a Firestore document reference
 */
export function getDocument(collectionPath: string, documentId: string) {
  return adminDb.collection(collectionPath).doc(documentId)
}

export function initializeFirebaseAdmin() {
  return getFirebaseAdmin()
}
