import { type NextRequest, NextResponse } from "next/server"
import { adminDb } from "@/lib/firebase-admin-server"
import { getServerSession } from "next-auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get all clinics (for super admin) or user's clinic
    let clinicsQuery = adminDb.collection("clinics")

    // If not super admin, filter by user's clinic
    if (session.user.role !== "SUPER_ADMIN") {
      if (!session.user.clinicId) {
        return NextResponse.json({ error: "No clinic access" }, { status: 403 })
      }
      clinicsQuery = clinicsQuery.where("__name__", "==", session.user.clinicId)
    }

    const clinicsSnapshot = await clinicsQuery.get()
    const clinics = clinicsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    return NextResponse.json({ clinics })
  } catch (error) {
    console.error("Error fetching clinics:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session?.user || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, ownerId, email, address } = body

    // Validate required fields
    if (!name || !ownerId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create clinic document
    const clinicRef = adminDb.collection("clinics").doc()

    await clinicRef.set({
      name,
      ownerId,
      email: email || "",
      address: address || "",
      createdAt: new Date(),
      updatedAt: new Date(),
      status: "active",
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

    // Update owner's clinicId
    await adminDb.collection("users").doc(ownerId).update({
      clinicId: clinicRef.id,
      updatedAt: new Date(),
    })

    return NextResponse.json(
      {
        message: "Clinic created successfully",
        clinicId: clinicRef.id,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating clinic:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
