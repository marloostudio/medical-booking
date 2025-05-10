"use server"

import { requirePermission } from "@/lib/auth-utils"
import { adminDb } from "@/lib/firebase-admin-server"
import { auditService } from "@/services/audit-service"
import { revalidatePath } from "next/cache"

export async function createPatient(formData: FormData) {
  try {
    const { session, userClinicId } = await requirePermission("create", "patients", "clinic")

    const patientData = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      dateOfBirth: formData.get("dateOfBirth") as string,
      gender: formData.get("gender") as string,
      clinicId: (formData.get("clinicId") as string) || userClinicId,
    }

    // Validate required fields
    const required = ["firstName", "lastName", "email", "phone", "dateOfBirth"]
    for (const field of required) {
      if (!patientData[field as keyof typeof patientData]) {
        throw new Error(`Missing required field: ${field}`)
      }
    }

    // Check if patient already exists
    const existingPatientQuery = adminDb
      .collection(`clinics/${patientData.clinicId}/patients`)
      .where("email", "==", patientData.email)

    const existingPatientSnapshot = await existingPatientQuery.get()
    if (!existingPatientSnapshot.empty) {
      throw new Error("Patient with this email already exists")
    }

    const now = new Date()
    const patientRef = adminDb.collection(`clinics/${patientData.clinicId}/patients`).doc()

    const patient = {
      ...patientData,
      id: patientRef.id,
      createdAt: now,
      updatedAt: now,
      createdBy: session.user.id,
    }

    await patientRef.set(patient)

    // Log the action
    await auditService.logAction(patientData.clinicId, {
      userId: session.user.id,
      action: "create",
      resource: "patient",
      resourceId: patientRef.id,
      details: `Created patient: ${patientData.firstName} ${patientData.lastName}`,
      ipAddress: "0.0.0.0",
      userAgent: "Server Action",
    })

    revalidatePath("/dashboard/patients")

    return {
      success: true,
      patientId: patientRef.id,
      message: "Patient created successfully",
    }
  } catch (error) {
    console.error("Error creating patient:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create patient",
    }
  }
}

export async function updatePatient(patientId: string, formData: FormData) {
  try {
    const { session, userClinicId } = await requirePermission("update", "patients", "clinic")

    const clinicId = (formData.get("clinicId") as string) || userClinicId
    if (!clinicId) {
      throw new Error("Clinic ID required")
    }

    const patientRef = adminDb.collection(`clinics/${clinicId}/patients`).doc(patientId)

    // Check if patient exists
    const patientDoc = await patientRef.get()
    if (!patientDoc.exists) {
      throw new Error("Patient not found")
    }

    const updateData = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      dateOfBirth: formData.get("dateOfBirth") as string,
      gender: formData.get("gender") as string,
      updatedAt: new Date(),
      updatedBy: session.user.id,
    }

    // Remove empty fields
    Object.keys(updateData).forEach((key) => {
      if (updateData[key as keyof typeof updateData] === "" || updateData[key as keyof typeof updateData] === null) {
        delete updateData[key as keyof typeof updateData]
      }
    })

    await patientRef.update(updateData)

    // Log the action
    await auditService.logAction(clinicId, {
      userId: session.user.id,
      action: "update",
      resource: "patient",
      resourceId: patientId,
      details: `Updated patient ${patientId}`,
      ipAddress: "0.0.0.0",
      userAgent: "Server Action",
    })

    revalidatePath("/dashboard/patients")

    return {
      success: true,
      message: "Patient updated successfully",
    }
  } catch (error) {
    console.error("Error updating patient:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update patient",
    }
  }
}

export async function deletePatient(patientId: string, clinicId?: string) {
  try {
    const { session, userClinicId } = await requirePermission("delete", "patients", "clinic")

    const targetClinicId = clinicId || userClinicId
    if (!targetClinicId) {
      throw new Error("Clinic ID required")
    }

    const patientRef = adminDb.collection(`clinics/${targetClinicId}/patients`).doc(patientId)

    // Check if patient exists
    const patientDoc = await patientRef.get()
    if (!patientDoc.exists) {
      throw new Error("Patient not found")
    }

    await patientRef.delete()

    // Log the action
    await auditService.logAction(targetClinicId, {
      userId: session.user.id,
      action: "delete",
      resource: "patient",
      resourceId: patientId,
      details: `Deleted patient ${patientId}`,
      ipAddress: "0.0.0.0",
      userAgent: "Server Action",
    })

    revalidatePath("/dashboard/patients")

    return {
      success: true,
      message: "Patient deleted successfully",
    }
  } catch (error) {
    console.error("Error deleting patient:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete patient",
    }
  }
}
