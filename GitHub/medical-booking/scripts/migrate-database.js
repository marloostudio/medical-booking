#!/usr/bin/env node

/**
 * Database Migration Script
 * Handles schema updates and data migrations
 */

const { initializeApp, cert } = require("firebase-admin/app")
const { getFirestore } = require("firebase-admin/firestore")

async function migrateDatabase() {
  try {
    console.log("🔄 Running database migrations...")

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

    console.log("📊 Checking for required migrations...")

    // Migration 1: Add updatedAt field to existing documents
    const clinicsSnapshot = await db.collection("clinics").get()
    let migrationCount = 0

    for (const doc of clinicsSnapshot.docs) {
      const data = doc.data()
      if (!data.updatedAt) {
        await doc.ref.update({
          updatedAt: new Date(),
        })
        migrationCount++
      }
    }

    if (migrationCount > 0) {
      console.log(`✅ Updated ${migrationCount} clinic documents with updatedAt field`)
    }

    // Migration 2: Ensure all users have proper role structure
    const usersSnapshot = await db.collection("users").get()
    let userMigrationCount = 0

    for (const doc of usersSnapshot.docs) {
      const data = doc.data()
      if (!data.permissions || !data.lastLoginAt) {
        await doc.ref.update({
          permissions: data.permissions || [],
          lastLoginAt: data.lastLoginAt || null,
          updatedAt: new Date(),
        })
        userMigrationCount++
      }
    }

    if (userMigrationCount > 0) {
      console.log(`✅ Updated ${userMigrationCount} user documents with new fields`)
    }

    console.log("✅ All migrations completed successfully!")
  } catch (error) {
    console.error("❌ Migration failed:", error)
    process.exit(1)
  }
}

// Run the migration
migrateDatabase()
