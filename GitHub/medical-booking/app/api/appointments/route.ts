import { type NextRequest, NextResponse } from "next/server"
import { requirePermissionApi } from "@/lib/auth-utils"
import { adminDb } from "@/lib/firebase-admin-server"
import { auditService } from "@/services/audit-service"
import { Timestamp } from "firebase-admin/firestore"

export async function GET(request: NextRequest) {
  try {
    const authResult = await requirePermissionApi(request, "read", "appointments", "clinic")
    if (authResult instanceof NextResponse) return authResult

    const { session, userClinicId } = authResult
    const { searchParams } = new URL(request.url)

    const clinicId = searchParams.get("clinicId") || userClinicId
    const staffId = searchParams.get("staffId")
    const patientId = searchParams.get("patientId")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")
    const status = searchParams.get("status")

    if (!clinicId) {
      return NextResponse.json({ error: "Clinic ID required" }, { status: 400 })
    }

    let appointmentsQuery = adminDb.collection(`clinics/${clinicId}/appointments`)

    // Apply filters
    if (staffId) {
      appointmentsQuery = appointmentsQuery.where("staffId", "==", staffId)
    }
    if (patientId) {
      appointmentsQuery = appointmentsQuery.where("patientId", "==", patientId)
    }
    if (status) {
      appointmentsQuery = appointmentsQuery.where("status", "==", status)
    }
    if (startDate) {
      appointmentsQuery = appointmentsQuery.where("startTime", ">=", Timestamp.fromDate(new Date(startDate)))
    }
    if (endDate) {
      appointmentsQuery = appointmentsQuery.where("startTime", "<=", Timestamp.fromDate(new Date(endDate)))
    }

    appointmentsQuery = appointmentsQuery.orderBy("startTime", "desc")

    const snapshot = await appointmentsQuery.get()
    const appointments = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      startTime: doc.data().startTime?.toDate?.()?.toISOString() || doc.data().startTime,
      endTime: doc.data().endTime?.toDate?.()?.toISOString() || doc.data().endTime,
    }))

    return NextResponse.json({ appointments })
  } catch (error) {
    console.error("Error fetching appointments:", error)
    return NextResponse.json({ error: "Failed to fetch appointments" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await requirePermissionApi(request, "create", "appointments", "clinic")
    if (authResult instanceof NextResponse) return authResult

    const { session, userClinicId } = authResult
    const appointmentData = await request.json()

    const clinicId = appointmentData.clinicId || userClinicId

    if (!clinicId) {
      return NextResponse.json({ error: "Clinic ID required" }, { status: 400 })
    }

    // Validate required fields
    const required = ["patientId", "staffId", "appointmentTypeId", "startTime", "endTime"]
    for (const field of required) {
      if (!appointmentData[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    const now = new Date()
    const appointmentRef = adminDb.collection(`clinics/${clinicId}/appointments`).doc()

    const appointment = {
      ...appointmentData,
      id: appointmentRef.id,
      clinicId,
      startTime: Timestamp.fromDate(new Date(appointmentData.startTime)),
      endTime: Timestamp.fromDate(new Date(appointmentData.endTime)),
      status: appointmentData.status || "scheduled",
      createdAt: Timestamp.fromDate(now),
      updatedAt: Timestamp.fromDate(now),
      createdBy: session.user.id,
    }

    await appointmentRef.set(appointment)

    // Log the action
    await auditService.logAction(clinicId, {
      userId: session.user.id,
      action: "create",
      resource: "appointment",
      resourceId: appointmentRef.id,
      details: `Created appointment for patient ${appointmentData.patientId}`,
      ipAddress: auditService.getClientIp(request),
      userAgent: auditService.getUserAgent(request),
    })

    return NextResponse.json(
      {
        success: true,
        appointmentId: appointmentRef.id,
        message: "Appointment created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating appointment:", error)
    return NextResponse.json({ error: "Failed to create appointment" }, { status: 500 })
  }
}
