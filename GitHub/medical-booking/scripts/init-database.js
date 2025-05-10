#!/usr/bin/env node

/**
 * Database Initialization Script
 * Sets up initial Firestore collections and indexes
 */

const { initializeApp, cert } = require("firebase-admin/app")
const { getFirestore } = require("firebase-admin/firestore")

async function initDatabase() {
  try {
    console.log("🚀 Initializing database...")

    // Initialize Firebase Admin if not already done
    if (!process.env.FIREBASE_PRIVATE_KEY) {
      console.error("❌ FIREBASE_PRIVATE_KEY environment variable is required")
      process.exit(1)
    }

    const serviceAccount = {
      type: "service_account",
      project_id: process.env.GCLOUD_PROJECT,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
    }

    const app = initializeApp({
      credential: cert(serviceAccount),
      projectId: process.env.GCLOUD_PROJECT,
    })

    const db = getFirestore(app)

    // Create initial collections with sample documents
    console.log("📝 Creating initial collections...")

    // Create a sample clinic
    const clinicRef = db.collection("clinics").doc("sample-clinic")
    await clinicRef.set({
      name: "Sample Medical Clinic",
      address: "123 Medical St, Health City, HC 12345",
      phone: "+1-555-0123",
      email: "contact@sampleclinic.com",
      settings: {
        timezone: "America/New_York",
        businessHours: {
          monday: { open: "09:00", close: "17:00" },
          tuesday: { open: "09:00", close: "17:00" },
          wednesday: { open: "09:00", close: "17:00" },
          thursday: { open: "09:00", close: "17:00" },
          friday: { open: "09:00", close: "17:00" },
          saturday: { open: "10:00", close: "14:00" },
          sunday: { open: false, close: false },
        },
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    console.log("✅ Database initialized successfully!")
    console.log("📋 Created collections:")
    console.log("   - clinics")
    console.log("   - users (will be created on first user signup)")
    console.log("   - appointments (will be created on first appointment)")
  } catch (error) {
    console.error("❌ Database initialization failed:", error)
    process.exit(1)
  }
}

// Run the initialization
initDatabase()
