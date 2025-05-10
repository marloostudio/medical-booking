import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"
import { getStorage } from "firebase-admin/storage"
import { getAuth } from "firebase-admin/auth"

// Initialize Firebase Admin
const apps = getApps()

if (!apps.length) {
  // If FIREBASE_PRIVATE_KEY is provided as a string with escaped newlines, we need to convert it
  const privateKey = process.env.FIREBASE_PRIVATE_KEY
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
    : undefined

  initializeApp({
    credential: cert({
      projectId: process.env.GCLOUD_PROJECT || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    }),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  })
}

// Get Firestore instance
const adminDb = getFirestore()
const adminStorage = getStorage()
const adminAuth = getAuth()

export { adminDb, adminStorage, adminAuth }

// Helper function to encrypt fields in Firestore
export async function encryptAndStoreDocument(collection: string, docId: string, data: any, fieldsToEncrypt: string[]) {
  const encryptionKey = process.env.ENCRYPTION_KEY
  if (!encryptionKey) {
    throw new Error("Encryption key is not set")
  }

  // Import encryption service
  const { encryptionService } = await import("./encryption")

  // Create a copy of the data
  const encryptedData = { ...data }

  // Encrypt sensitive fields
  for (const field of fieldsToEncrypt) {
    if (encryptedData[field]) {
      encryptedData[field] = encryptionService.encrypt(
        typeof encryptedData[field] === "string" ? encryptedData[field] : JSON.stringify(encryptedData[field]),
      )
    }
  }

  // Add metadata
  encryptedData._encrypted = fieldsToEncrypt
  encryptedData._updatedAt = new Date().toISOString()

  // Store in Firestore
  const docRef = adminDb.collection(collection).doc(docId)
  await docRef.set(encryptedData, { merge: true })

  return docId
}

// Helper function to decrypt fields from Firestore
export async function getAndDecryptDocument(collection: string, docId: string) {
  // Import encryption service
  const { encryptionService } = await import("./encryption")

  // Get document
  const docRef = adminDb.collection(collection).doc(docId)
  const doc = await docRef.get()

  if (!doc.exists) {
    return null
  }

  const data = doc.data()
  const encryptedFields = data._encrypted || []

  // Decrypt fields
  for (const field of encryptedFields) {
    if (data[field]) {
      try {
        const decrypted = encryptionService.decrypt(data[field])

        // Try to parse as JSON if possible
        try {
          data[field] = JSON.parse(decrypted)
        } catch {
          data[field] = decrypted
        }
      } catch (error) {
        console.error(`Error decrypting field ${field}:`, error)
        // Keep the encrypted value if decryption fails
      }
    }
  }

  // Remove metadata
  delete data._encrypted

  return {
    id: docId,
    ...data,
  }
}
