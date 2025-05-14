import * as admin from "firebase-admin"
import { getApps } from "firebase-admin/app"
import { getFirestore, type CollectionReference, type DocumentReference } from "firebase-admin/firestore"

// Firebase Admin configuration
const firebaseAdminConfig = {
  credential: admin.credential.cert({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    // Replace escaped newlines in the private key
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
  databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com`,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
}

// Initialize Firebase Admin (Singleton Pattern)
export function initializeFirebaseAdmin(): admin.app.App {
  try {
    // Check if Firebase Admin is already initialized
    if (!getApps().length) {
      admin.initializeApp(firebaseAdminConfig)
      console.log("Firebase Admin initialized successfully")
    } else {
      console.log("Firebase Admin already initialized")
    }
    return admin.app()
  } catch (error) {
    console.error("Error initializing Firebase Admin:", error)
    throw error
  }
}

// Get Firestore instance (Singleton Pattern)
export const adminDb = (() => {
  try {
    initializeFirebaseAdmin()
    return getFirestore()
  } catch (error) {
    console.error("Error getting Firestore instance:", error)
    throw error
  }
})()

// Get Firebase Auth instance
export const adminAuth = (() => {
  try {
    initializeFirebaseAdmin()
    return admin.auth()
  } catch (error) {
    console.error("Error getting Firebase Auth instance:", error)
    throw error
  }
})()

// Get a Firestore collection reference - FIXED to use adminDb.collection directly
export function getCollection(collectionPath: string): CollectionReference {
  try {
    if (!collectionPath || typeof collectionPath !== "string") {
      throw new Error(`Invalid collection path: ${collectionPath}`)
    }

    // Ensure Firestore is initialized
    if (!adminDb) {
      throw new Error("Firestore is not initialized")
    }

    // Use adminDb.collection directly as requested
    return adminDb.collection(collectionPath)
  } catch (error) {
    console.error(`Error getting collection '${collectionPath}':`, error)
    throw error
  }
}

// Get a Firestore document reference
export function getDocument(collectionPath: string, documentId: string): DocumentReference {
  try {
    if (!collectionPath || typeof collectionPath !== "string") {
      throw new Error(`Invalid collection path: ${collectionPath}`)
    }

    if (!documentId || typeof documentId !== "string") {
      throw new Error(`Invalid document ID: ${documentId}`)
    }

    // Ensure Firestore is initialized
    if (!adminDb) {
      throw new Error("Firestore is not initialized")
    }

    // Get the document reference
    return adminDb.collection(collectionPath).doc(documentId)
  } catch (error) {
    console.error(`Error getting document '${documentId}' from collection '${collectionPath}':`, error)
    throw error
  }
}
