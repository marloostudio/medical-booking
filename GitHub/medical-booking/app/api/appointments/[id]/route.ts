import { type NextRequest, NextResponse } from "next/server"
import { requirePermissionApi } from "@/lib/auth-utils"
import { adminDb } from "@/lib/firebase-admin-server"
import { auditService } from "@/services/audit-service"
import { Timestamp } from "firebase-admin/firestore"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = await requirePermissionApi(request, "read", "appointments", "clinic")
    if (authResult instanceof NextResponse) return authResult

    const { session, userClinicId } = authResult
    const appointmentId = params.id
    const { searchParams } = new URL(request.url)
    const clinicId = searchParams.get("clinicId") || userClinicId

    if (!clinicId) {
      return NextResponse.json({ error: "Clinic ID required" }, { status: 400 })
    }

    const appointmentRef = adminDb.collection(`clinics/${clinicId}/appointments`).doc(appointmentId)
    const appointmentDoc = await appointmentRef.get()

    if (!appointmentDoc.exists) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 })
    }

    const appointmentData = appointmentDoc.data()
    const appointment = {
      id: appointmentDoc.id,
      ...appointmentData,
      startTime: appointmentData?.startTime?.toDate?.()?.toISOString() || appointmentData?.startTime,
      endTime: appointmentData?.endTime?.toDate?.()?.toISOString() || appointmentData?.endTime,
    }

    return NextResponse.json({ appointment })
  } catch (error) {
    console.error("Error fetching appointment:", error)
    return NextResponse.json({ error: "Failed to fetch appointment" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = await requirePermissionApi(request, "update", "appointments", "clinic")
    if (authResult instanceof NextResponse) return authResult

    const { session, userClinicId } = authResult
    const appointmentId = params.id
    const updateData = await request.json()
    const clinicId = updateData.clinicId || userClinicId

    if (!clinicId) {
      return NextResponse.json({ error: "Clinic ID required" }, { status: 400 })
    }

    const appointmentRef = adminDb.collection(`clinics/${clinicId}/appointments`).doc(appointmentId)

    // Check if appointment exists
    const appointmentDoc = await appointmentRef.get()
    if (!appointmentDoc.exists) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 })
    }

    // Prepare update data
    const updates: any = {
      ...updateData,
      updatedAt: Timestamp.fromDate(new Date()),
      updatedBy: session.user.id,
    }

    // Convert date strings to Timestamps if provided
    if (updateData.startTime) {
      updates.startTime = Timestamp.fromDate(new Date(updateData.startTime))
    }
    if (updateData.endTime) {
      updates.endTime = Timestamp.fromDate(new Date(updateData.endTime))
    }

    // Remove fields that shouldn't be updated
    delete updates.id
    delete updates.clinicId
    delete updates.createdAt
    delete updates.createdBy

    await appointmentRef.update(updates)

    // Log the action
    await auditService.logAction(clinicId, {
      userId: session.user.id,
      action: "update",
      resource: "appointment",
      resourceId: appointmentId,
      details: `Updated appointment ${appointmentId}`,
      ipAddress: auditService.getClientIp(request),
      userAgent: auditService.getUserAgent(request),
    })

    return NextResponse.json({
      success: true,
      message: "Appointment updated successfully",
    })
  } catch (error) {
    console.error("Error updating appointment:", error)
    return NextResponse.json({ error: "Failed to update appointment" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = await requirePermissionApi(request, "delete", "appointments", "clinic")
    if (authResult instanceof NextResponse) return authResult

    const { session, userClinicId } = authResult
    const appointmentId = params.id
    const { searchParams } = new URL(request.url)
    const clinicId = searchParams.get("clinicId") || userClinicId

    if (!clinicId) {
      return NextResponse.json({ error: "Clinic ID required" }, { status: 400 })
    }

    const appointmentRef = adminDb.collection(`clinics/${clinicId}/appointments`).doc(appointmentId)

    // Check if appointment exists
    const appointmentDoc = await appointmentRef.get()
    if (!appointmentDoc.exists) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 })
    }

    await appointmentRef.delete()

    // Log the action
    await auditService.logAction(clinicId, {
      userId: session.user.id,
      action: "delete",
      resource: "appointment",
      resourceId: appointmentId,
      details: `Deleted appointment ${appointmentId}`,
      ipAddress: auditService.getClientIp(request),
      userAgent: auditService.getUserAgent(request),
    })

    return NextResponse.json({
      success: true,
      message: "Appointment deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting appointment:", error)
    return NextResponse.json({ error: "Failed to delete appointment" }, { status: 500 })
  }
}
