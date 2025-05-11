import { type NextRequest, NextResponse } from "next/server"
import { adminAuth, adminDb } from "@/lib/firebase-admin"

export async function POST(request: NextRequest) {
  try {
    // Check for authorization
    const authHeader = request.headers.get("authorization")
    if (!authHeader || authHeader !== `Bearer ${process.env.BACKUP_SECRET_TOKEN}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const email = process.env.ADMIN_EMAIL
    const password = process.env.ADMIN_PASSWORD
    const name = process.env.ADMIN_NAME

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Missing required environment variables: ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME" },
        { status: 400 },
      )
    }

    // Check if user already exists
    try {
      const userRecord = await adminAuth.getUserByEmail(email)

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

      return NextResponse.json({
        success: true,
        message: "Updated existing user to SUPER_ADMIN role",
        uid: userRecord.uid,
      })
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

    return NextResponse.json({
      success: true,
      message: "Successfully created super admin user",
      uid: userRecord.uid,
    })
  } catch (error) {
    console.error("Error creating super admin:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
