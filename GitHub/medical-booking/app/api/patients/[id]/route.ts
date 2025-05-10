import { type NextRequest, NextResponse } from "next/server"
import { requirePermissionApi } from "@/lib/auth-utils"
import { adminDb } from "@/lib/firebase-admin-server"
import { auditService } from "@/services/audit-service"
import { encryptionService } from "@/lib/encryption"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = await requirePermissionApi(request, "read", "patients", "clinic")
    if (authResult instanceof NextResponse) return authResult

    const { session, userClinicId } = authResult
    const patientId = params.id
    const { searchParams } = new URL(request.url)
    const clinicId = searchParams.get("clinicId") || userClinicId

    if (!clinicId) {
      return NextResponse.json({ error: "Clinic ID required" }, { status: 400 })
    }

    const patientRef = adminDb.collection(`clinics/${clinicId}/patients`).doc(patientId)
    const patientDoc = await patientRef.get()

    if (!patientDoc.exists) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 })
    }

    const patientData = patientDoc.data()

    // Decrypt sensitive fields for authorized users
    const decryptedData = { ...patientData }
    if (patientData?.insuranceInfo?.policyNumber) {
      decryptedData.insuranceInfo = {
        ...patientData.insuranceInfo,
        policyNumber: encryptionService.decrypt(patientData.insuranceInfo.policyNumber),
        groupNumber: patientData.insuranceInfo.groupNumber
          ? encryptionService.decrypt(patientData.insuranceInfo.groupNumber)
          : undefined,
      }
    }

    const patient = {
      id: patientDoc.id,
      ...decryptedData,
    }

    return NextResponse.json({ patient })
  } catch (error) {
    console.error("Error fetching patient:", error)
    return NextResponse.json({ error: "Failed to fetch patient" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = await requirePermissionApi(request, "update", "patients", "clinic")
    if (authResult instanceof NextResponse) return authResult

    const { session, userClinicId } = authResult
    const patientId = params.id
    const updateData = await request.json()
    const clinicId = updateData.clinicId || userClinicId

    if (!clinicId) {
      return NextResponse.json({ error: "Clinic ID required" }, { status: 400 })
    }

    const patientRef = adminDb.collection(`clinics/${clinicId}/patients`).doc(patientId)

    // Check if patient exists
    const patientDoc = await patientRef.get()
    if (!patientDoc.exists) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 })
    }

    // Encrypt sensitive fields
    const encryptedData = { ...updateData }
    if (updateData.insuranceInfo?.policyNumber) {
      encryptedData.insuranceInfo = {
        ...updateData.insuranceInfo,
        policyNumber: encryptionService.encrypt(updateData.insuranceInfo.policyNumber),
        groupNumber: updateData.insuranceInfo.groupNumber
          ? encryptionService.encrypt(updateData.insuranceInfo.groupNumber)
          : undefined,
      }
    }

    // Prepare update data
    const updates = {
      ...encryptedData,
      updatedAt: new Date(),
      updatedBy: session.user.id,
    }

    // Remove fields that shouldn't be updated
    delete updates.id
    delete updates.clinicId
    delete updates.createdAt
    delete updates.createdBy

    await patientRef.update(updates)

    // Log the action
    await auditService.logAction(clinicId, {
      userId: session.user.id,
      action: "update",
      resource: "patient",
      resourceId: patientId,
      details: `Updated patient ${patientId}`,
      ipAddress: auditService.getClientIp(request),
      userAgent: auditService.getUserAgent(request),
    })

    return NextResponse.json({
      success: true,
      message: "Patient updated successfully",
    })
  } catch (error) {
    console.error("Error updating patient:", error)
    return NextResponse.json({ error: "Failed to update patient" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = await requirePermissionApi(request, "delete", "patients", "clinic")
    if (authResult instanceof NextResponse) return authResult

    const { session, userClinicId } = authResult
    const patientId = params.id
    const { searchParams } = new URL(request.url)
    const clinicId = searchParams.get("clinicId") || userClinicId

    if (!clinicId) {
      return NextResponse.json({ error: "Clinic ID required" }, { status: 400 })
    }

    const patientRef = adminDb.collection(`clinics/${clinicId}/patients`).doc(patientId)

    // Check if patient exists
    const patientDoc = await patientRef.get()
    if (!patientDoc.exists) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 })
    }

    await patientRef.delete()

    // Log the action
    await auditService.logAction(clinicId, {
      userId: session.user.id,
      action: "delete",
      resource: "patient",
      resourceId: patientId,
      details: `Deleted patient ${patientId}`,
      ipAddress: auditService.getClientIp(request),
      userAgent: auditService.getUserAgent(request),
    })

    return NextResponse.json({
      success: true,
      message: "Patient deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting patient:", error)
    return NextResponse.json({ error: "Failed to delete patient" }, { status: 500 })
  }
}
