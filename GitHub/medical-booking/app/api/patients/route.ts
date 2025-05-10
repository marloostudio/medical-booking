import { type NextRequest, NextResponse } from "next/server"
import { requirePermissionApi } from "@/lib/auth-utils"
import { adminDb } from "@/lib/firebase-admin-server"
import { auditService } from "@/services/audit-service"
import { encryptionService } from "@/lib/encryption"

export async function GET(request: NextRequest) {
  try {
    const authResult = await requirePermissionApi(request, "read", "patients", "clinic")
    if (authResult instanceof NextResponse) return authResult

    const { session, userClinicId } = authResult
    const { searchParams } = new URL(request.url)

    const clinicId = searchParams.get("clinicId") || userClinicId
    const search = searchParams.get("search")
    const limit = searchParams.get("limit")

    if (!clinicId) {
      return NextResponse.json({ error: "Clinic ID required" }, { status: 400 })
    }

    let patientsQuery = adminDb.collection(`clinics/${clinicId}/patients`)

    // Apply search filter if provided
    if (search) {
      // For simplicity, we'll search by email. In production, you might want to use a search service
      patientsQuery = patientsQuery.where("email", ">=", search).where("email", "<=", search + "\uf8ff")
    }

    patientsQuery = patientsQuery.orderBy("lastName")

    if (limit) {
      patientsQuery = patientsQuery.limit(Number.parseInt(limit))
    }

    const snapshot = await patientsQuery.get()
    const patients = snapshot.docs.map((doc) => {
      const data = doc.data()

      // Decrypt sensitive fields for authorized users
      const decryptedData = { ...data }
      if (data.insuranceInfo?.policyNumber) {
        decryptedData.insuranceInfo = {
          ...data.insuranceInfo,
          policyNumber: encryptionService.decrypt(data.insuranceInfo.policyNumber),
          groupNumber: data.insuranceInfo.groupNumber
            ? encryptionService.decrypt(data.insuranceInfo.groupNumber)
            : undefined,
        }
      }

      return {
        id: doc.id,
        ...decryptedData,
      }
    })

    return NextResponse.json({ patients })
  } catch (error) {
    console.error("Error fetching patients:", error)
    return NextResponse.json({ error: "Failed to fetch patients" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await requirePermissionApi(request, "create", "patients", "clinic")
    if (authResult instanceof NextResponse) return authResult

    const { session, userClinicId } = authResult
    const patientData = await request.json()

    const clinicId = patientData.clinicId || userClinicId

    if (!clinicId) {
      return NextResponse.json({ error: "Clinic ID required" }, { status: 400 })
    }

    // Validate required fields
    const required = ["firstName", "lastName", "email", "phone", "dateOfBirth"]
    for (const field of required) {
      if (!patientData[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Check if patient already exists
    const existingPatientQuery = adminDb
      .collection(`clinics/${clinicId}/patients`)
      .where("email", "==", patientData.email)

    const existingPatientSnapshot = await existingPatientQuery.get()
    if (!existingPatientSnapshot.empty) {
      return NextResponse.json({ error: "Patient with this email already exists" }, { status: 400 })
    }

    const now = new Date()
    const patientRef = adminDb.collection(`clinics/${clinicId}/patients`).doc()

    // Encrypt sensitive fields
    const encryptedData = { ...patientData }
    if (patientData.insuranceInfo?.policyNumber) {
      encryptedData.insuranceInfo = {
        ...patientData.insuranceInfo,
        policyNumber: encryptionService.encrypt(patientData.insuranceInfo.policyNumber),
        groupNumber: patientData.insuranceInfo.groupNumber
          ? encryptionService.encrypt(patientData.insuranceInfo.groupNumber)
          : undefined,
      }
    }

    const patient = {
      ...encryptedData,
      id: patientRef.id,
      clinicId,
      createdAt: now,
      updatedAt: now,
      createdBy: session.user.id,
    }

    await patientRef.set(patient)

    // Log the action
    await auditService.logAction(clinicId, {
      userId: session.user.id,
      action: "create",
      resource: "patient",
      resourceId: patientRef.id,
      details: `Created patient: ${patientData.firstName} ${patientData.lastName}`,
      ipAddress: auditService.getClientIp(request),
      userAgent: auditService.getUserAgent(request),
    })

    return NextResponse.json(
      {
        success: true,
        patientId: patientRef.id,
        message: "Patient created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating patient:", error)
    return NextResponse.json({ error: "Failed to create patient" }, { status: 500 })
  }
}
