import * as admin from "firebase-admin";
import { getApps } from "firebase-admin/app";
import { getFirestore, type CollectionReference } from "firebase-admin/firestore";

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
};

// Initialize Firebase Admin (Singleton Pattern)
export function initializeFirebaseAdmin(): admin.app.App {
  try {
    if (!getApps().length) {
      admin.initializeApp(firebaseAdminConfig);
      console.log("Firebase Admin initialized successfully");
    }
    return admin.app();
  } catch (error) {
    console.error("Error initializing Firebase Admin:", error);
    throw error;
  }
}

// Get Firestore instance (Singleton Pattern)
export const adminDb = (() => {
  try {
    initializeFirebaseAdmin();
    return getFirestore();
  } catch (error) {
    console.error("Error getting Firestore instance:", error);
    throw error;
  }
})();

// Get Firebase Auth instance
export const adminAuth = (() => {
  try {
    const adminApp = initializeFirebaseAdmin();
    return adminApp.auth();
  } catch (error) {
    console.error("Error getting Firebase Auth instance:", error);
    throw error;
  }
})();

// Get a Firestore collection reference
export function getCollection(collectionPath: string): CollectionReference {
  try {
    if (!collectionPath || typeof collectionPath !== "string") {
      throw new Error(`Invalid collection path: ${collectionPath}`);
    }

    // Ensure Firestore is initialized
    if (!adminDb) {
      throw new Error("Firestore is not initialized");
    }

    // Use the Firestore instance to get the collection reference
    return adminDb.collection(collectionPath) as CollectionReference;
  } catch (error) {
    console.error(`Error getting collection '${collectionPath}':`, error);
    throw error;
  }
}
