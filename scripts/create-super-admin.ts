import { adminAuth, adminDb } from "../lib/firebase-admin"

/**
 * This script creates a super admin user in Firebase Auth and Firestore
 * Run this script with: npx ts-node scripts/create-super-admin.ts
 *
 * Environment variables needed:
 * - ADMIN_EMAIL: The email for the super admin
 * - ADMIN_PASSWORD: The password for the super admin
 * - ADMIN_NAME: The name for the super admin
 */

async function createSuperAdmin() {
  try {
    const email = process.env.ADMIN_EMAIL
    const password = process.env.ADMIN_PASSWORD
    const name = process.env.ADMIN_NAME

    if (!email || !password || !name) {
      console.error("Missing required environment variables: ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME")
      process.exit(1)
    }

    console.log(`Creating super admin user with email: ${email}`)

    // Check if user already exists
    try {
      const userRecord = await adminAuth.getUserByEmail(email)
      console.log(`User already exists with UID: ${userRecord.uid}`)

      // Update user claims to include super admin role
      await adminAuth.setCustomUserClaims(userRecord.uid, { role: "SUPER_ADMIN" })

      // Update or create user document in Firestore
      await adminDb.collection("users").doc(userRecord.uid).set(
        {
          email,
          name,
          role: "SUPER_ADMIN",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        { merge: true },
      )

      console.log(`Updated existing user to SUPER_ADMIN role`)
      return
    } catch (error) {
      // User doesn't exist, continue with creation
      if (error.code !== "auth/user-not-found") {
        throw error
      }
    }

    // Create new user
    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: name,
    })

    console.log(`Created new user with UID: ${userRecord.uid}`)

    // Set custom claims for super admin role
    await adminAuth.setCustomUserClaims(userRecord.uid, { role: "SUPER_ADMIN" })

    // Create user document in Firestore
    await adminDb.collection("users").doc(userRecord.uid).set({
      email,
      name,
      role: "SUPER_ADMIN",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })

    console.log(`Successfully created super admin user`)

    // Create an audit log entry
    await adminDb.collection("auditLogs").add({
      action: "create_super_admin",
      userId: userRecord.uid,
      timestamp: new Date().toISOString(),
      details: {
        email,
        name,
      },
    })

    console.log(`Created audit log entry`)
  } catch (error) {
    console.error("Error creating super admin:", error)
    process.exit(1)
  }
}

createSuperAdmin()
  .then(() => {
    console.log("Super admin creation completed")
    process.exit(0)
  })
  .catch((error) => {
    console.error("Unhandled error:", error)
    process.exit(1)
  })
