import { type NextRequest, NextResponse } from "next/server"
import { adminAuth, adminDb } from "@/lib/firebase-admin"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name, clinicName, address } = body

    // Validate required fields
    if (!email || !password || !name || !clinicName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if user already exists
    try {
      await adminAuth.getUserByEmail(email)
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    } catch (error) {
      // User doesn't exist, which is what we want
    }

    // Create user in Firebase Auth
    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: name,
      emailVerified: false,
    })

    // Generate a unique clinic ID
    const clinicId = `clinic_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Create clinic document
    await adminDb
      .collection("clinics")
      .doc(clinicId)
      .set({
        name: clinicName,
        owner: userRecord.uid,
        email: email,
        address: {
          street: address?.street || "",
          city: address?.city || "",
          state: address?.state || "",
          zipCode: address?.zipCode || "",
          country: address?.country || "US",
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        status: "active",
        plan: "basic",
        settings: {
          appointmentBuffer: 15,
          defaultAppointmentDuration: 30,
          weekStartsOn: 0,
          businessHours: {
            monday: { isOpen: true, open: "09:00", close: "17:00" },
            tuesday: { isOpen: true, open: "09:00", close: "17:00" },
            wednesday: { isOpen: true, open: "09:00", close: "17:00" },
            thursday: { isOpen: true, open: "09:00", close: "17:00" },
            friday: { isOpen: true, open: "09:00", close: "17:00" },
            saturday: { isOpen: false, open: "09:00", close: "13:00" },
            sunday: { isOpen: false, open: "00:00", close: "00:00" },
          },
        },
      })

    // Create user profile
    await adminDb.collection("users").doc(userRecord.uid).set({
      email: email,
      displayName: name,
      clinicId: clinicId,
      role: "CLINIC_OWNER",
      createdAt: new Date(),
      updatedAt: new Date(),
      emailVerified: false,
      status: "active",
      lastLogin: new Date(),
    })

    // Create staff record
    await adminDb
      .collection("staff")
      .doc(userRecord.uid)
      .set({
        clinicId: clinicId,
        name: name,
        email: email,
        role: "CLINIC_OWNER",
        permissions: ["all"],
        createdAt: new Date(),
        updatedAt: new Date(),
      })

    return NextResponse.json(
      {
        message: "User created successfully",
        userId: userRecord.uid,
        clinicId: clinicId,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}
