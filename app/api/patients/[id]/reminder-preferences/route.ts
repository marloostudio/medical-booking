import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { notificationService } from "@/services/notification-service"
import { auditService } from "@/services/audit-service"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)

    if (!session || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get clinic ID from session
    const clinicId = session.user.clinicId

    if (!clinicId) {
      return NextResponse.json({ error: "No clinic associated with user" }, { status: 400 })
    }

    // Get patient ID from params
    const patientId = params.id

    // Get patient reminder preferences
    const preferences = await notificationService.getPatientReminderPreferences(clinicId, patientId)

    return NextResponse.json(preferences)
  } catch (error) {
    console.error("Error getting patient reminder preferences:", error)
    return NextResponse.json({ error: "Failed to get patient reminder preferences" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)

    if (!session || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get clinic ID from session
    const clinicId = session.user.clinicId

    if (!clinicId) {
      return NextResponse.json({ error: "No clinic associated with user" }, { status: 400 })
    }

    // Get patient ID from params
    const patientId = params.id

    // Get preferences data from request
    const preferences = await request.json()

    // Update patient reminder preferences
    await notificationService.updatePatientReminderPreferences(clinicId, patientId, preferences)

    // Log the action
    await auditService.logAction(clinicId, {
      userId: session.user.id,
      action: "update",
      resource: "patientReminderPreferences",
      details: `Updated reminder preferences for patient: ${patientId}`,
      ipAddress: auditService.getClientIp(request),
      userAgent: auditService.getUserAgent(request),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating patient reminder preferences:", error)
    return NextResponse.json({ error: "Failed to update patient reminder preferences" }, { status: 500 })
  }
}
