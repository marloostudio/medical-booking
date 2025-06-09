import { type NextRequest, NextResponse } from "next/server"
import { getCollection } from "@/lib/firebase-admin"

// Set the runtime to nodejs to ensure Firebase Admin works correctly
export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate the appointment data
    if (!data || !data.patientId || !data.appointmentDate) {
      return NextResponse.json({ error: "Invalid appointment data" }, { status: 400 })
    }

    // Create the appointment in Firestore
    const appointmentsCollection = getCollection("appointments")
    const result = await appointmentsCollection.add({
      ...data,
      createdAt: new Date().toISOString(),
      status: "scheduled",
    })

    return NextResponse.json({
      success: true,
      appointmentId: result.id,
    })
  } catch (error) {
    console.error("Error booking appointment:", error)
    return NextResponse.json({ error: "Failed to book appointment" }, { status: 500 })
  }
}
