"use server"

import { requirePermission } from "@/lib/auth-utils"
import { adminDb } from "@/lib/firebase-admin-server"
import { auditService } from "@/services/audit-service"
import { revalidatePath } from "next/cache"
import { Timestamp } from "firebase-admin/firestore"

export async function createAppointment(formData: FormData) {
  try {
    const { session, userClinicId } = await requirePermission("create", "appointments", "clinic")

    const appointmentData = {
      patientId: formData.get("patientId") as string,
      staffId: formData.get("staffId") as string,
      appointmentTypeId: formData.get("appointmentTypeId") as string,
      startTime: formData.get("startTime") as string,
      endTime: formData.get("endTime") as string,
      patientNotes: formData.get("patientNotes") as string,
      clinicId: (formData.get("clinicId") as string) || userClinicId,
    }

    // Validate required fields
    const required = ["patientId", "staffId", "appointmentTypeId", "startTime", "endTime"]
    for (const field of required) {
      if (!appointmentData[field as keyof typeof appointmentData]) {
        throw new Error(`Missing required field: ${field}`)
      }
    }

    const now = new Date()
    const appointmentRef = adminDb.collection(`clinics/${appointmentData.clinicId}/appointments`).doc()

    const appointment = {
      ...appointmentData,
      id: appointmentRef.id,
      startTime: Timestamp.fromDate(new Date(appointmentData.startTime)),
      endTime: Timestamp.fromDate(new Date(appointmentData.endTime)),
      status: "scheduled",
      createdAt: Timestamp.fromDate(now),
      updatedAt: Timestamp.fromDate(now),
      createdBy: session.user.id,
    }

    await appointmentRef.set(appointment)

    // Log the action
    await auditService.logAction(appointmentData.clinicId, {
      userId: session.user.id,
      action: "create",
      resource: "appointment",
      resourceId: appointmentRef.id,
      details: `Created appointment for patient ${appointmentData.patientId}`,
      ipAddress: "0.0.0.0",
      userAgent: "Server Action",
    })

    revalidatePath("/dashboard/appointments")
    revalidatePath("/dashboard/calendar")

    return {
      success: true,
      appointmentId: appointmentRef.id,
      message: "Appointment created successfully",
    }
  } catch (error) {
    console.error("Error creating appointment:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create appointment",
    }
  }
}

export async function updateAppointmentStatus(appointmentId: string, status: string, clinicId?: string) {
  try {
    const { session, userClinicId } = await requirePermission("update", "appointments", "clinic")

    const targetClinicId = clinicId || userClinicId
    if (!targetClinicId) {
      throw new Error("Clinic ID required")
    }

    const appointmentRef = adminDb.collection(`clinics/${targetClinicId}/appointments`).doc(appointmentId)

    // Check if appointment exists
    const appointmentDoc = await appointmentRef.get()
    if (!appointmentDoc.exists) {
      throw new Error("Appointment not found")
    }

    await appointmentRef.update({
      status,
      updatedAt: Timestamp.fromDate(new Date()),
      updatedBy: session.user.id,
    })

    // Log the action
    await auditService.logAction(targetClinicId, {
      userId: session.user.id,
      action: "update",
      resource: "appointment",
      resourceId: appointmentId,
      details: `Updated appointment status to ${status}`,
      ipAddress: "0.0.0.0",
      userAgent: "Server Action",
    })

    revalidatePath("/dashboard/appointments")
    revalidatePath("/dashboard/calendar")

    return {
      success: true,
      message: "Appointment status updated successfully",
    }
  } catch (error) {
    console.error("Error updating appointment status:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update appointment status",
    }
  }
}

export async function cancelAppointment(appointmentId: string, reason?: string, clinicId?: string) {
  try {
    const { session, userClinicId } = await requirePermission("update", "appointments", "clinic")

    const targetClinicId = clinicId || userClinicId
    if (!targetClinicId) {
      throw new Error("Clinic ID required")
    }

    const appointmentRef = adminDb.collection(`clinics/${targetClinicId}/appointments`).doc(appointmentId)

    // Check if appointment exists
    const appointmentDoc = await appointmentRef.get()
    if (!appointmentDoc.exists) {
      throw new Error("Appointment not found")
    }

    await appointmentRef.update({
      status: "cancelled",
      cancellationReason: reason || "",
      cancelledAt: Timestamp.fromDate(new Date()),
      cancelledBy: session.user.id,
      updatedAt: Timestamp.fromDate(new Date()),
      updatedBy: session.user.id,
    })

    // Log the action
    await auditService.logAction(targetClinicId, {
      userId: session.user.id,
      action: "update",
      resource: "appointment",
      resourceId: appointmentId,
      details: `Cancelled appointment. Reason: ${reason || "No reason provided"}`,
      ipAddress: "0.0.0.0",
      userAgent: "Server Action",
    })

    revalidatePath("/dashboard/appointments")
    revalidatePath("/dashboard/calendar")

    return {
      success: true,
      message: "Appointment cancelled successfully",
    }
  } catch (error) {
    console.error("Error cancelling appointment:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to cancel appointment",
    }
  }
}
