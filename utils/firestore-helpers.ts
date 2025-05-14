import { getFirestore } from "firebase-admin/firestore"
import { initializeFirebaseAdmin } from "@/lib/firebase-admin"

// Initialize Firebase Admin if not already initialized
export const ensureFirebaseAdmin = () => {
  try {
    initializeFirebaseAdmin()
    return getFirestore()
  } catch (error) {
    console.error("Error initializing Firebase Admin:", error)
    throw error
  }
}

// Safely get a collection reference
export const safeGetCollection = (collectionName: string) => {
  if (!collectionName || typeof collectionName !== "string") {
    throw new Error(`Invalid collection name: ${collectionName}`)
  }

  const db = ensureFirebaseAdmin()
  return db.collection(collectionName)
}

// Safely get a document reference
export const safeGetDocument = (collectionName: string, documentId: string) => {
  if (!collectionName || !documentId) {
    throw new Error(`Invalid collection name or document ID: ${collectionName}/${documentId}`)
  }

  const db = ensureFirebaseAdmin()
  return db.collection(collectionName).doc(documentId)
}

// Safely perform a query
export const safeQuery = async (queryFn: () => Promise<any>) => {
  try {
    return await queryFn()
  } catch (error) {
    console.error("Error executing Firestore query:", error)
    throw error
  }
}
