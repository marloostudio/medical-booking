import { type NextRequest, NextResponse } from "next/server"
import { adminAuth, adminDb } from "@/lib/firebase-admin"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, password, role, clinicName, phone } = body

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if user already exists
    try {
      await adminAuth.getUserByEmail(email)
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    } catch (error) {
      // User doesn't exist, continue with creation
    }

    // Create user in Firebase Auth
    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: `${firstName} ${lastName}`,
    })

    // Create clinic if user is clinic owner
    let clinicId = null
    if (role === "CLINIC_OWNER" && clinicName) {
      const clinicRef = adminDb.collection("clinics").doc()
      clinicId = clinicRef.id

      await clinicRef.set({
        name: clinicName,
        ownerId: userRecord.uid,
        createdAt: new Date(),
        settings: {
          timezone: "America/Toronto",
          businessHours: {
            monday: { start: "09:00", end: "17:00", enabled: true },
            tuesday: { start: "09:00", end: "17:00", enabled: true },
            wednesday: { start: "09:00", end: "17:00", enabled: true },
            thursday: { start: "09:00", end: "17:00", enabled: true },
            friday: { start: "09:00", end: "17:00", enabled: true },
            saturday: { start: "09:00", end: "13:00", enabled: false },
            sunday: { start: "09:00", end: "13:00", enabled: false },
          },
        },
      })
    }

    // Create user document in Firestore
    await adminDb
      .collection("users")
      .doc(userRecord.uid)
      .set({
        firstName,
        lastName,
        email,
        role,
        clinicId,
        phone: phone || null,
        createdAt: new Date(),
        emailVerified: false,
        isActive: true,
      })

    return NextResponse.json({ message: "User created successfully", userId: userRecord.uid }, { status: 201 })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
