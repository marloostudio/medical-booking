"use server"

import { adminDb } from "@/lib/firebase-admin-server"
import { getServerSession } from "next-auth"
import { revalidatePath } from "next/cache"

export interface Provider {
  id: string
  firstName: string
  lastName: string
  title: string
  specialties: string[]
  email: string
  phone: string
  bio: string
  availability: {
    monday: { available: boolean; slots: { start: string; end: string }[] }
    tuesday: { available: boolean; slots: { start: string; end: string }[] }
    wednesday: { available: boolean; slots: { start: string; end: string }[] }
    thursday: { available: boolean; slots: { start: string; end: string }[] }
    friday: { available: boolean; slots: { start: string; end: string }[] }
    saturday: { available: boolean; slots: { start: string; end: string }[] }
    sunday: { available: boolean; slots: { start: string; end: string }[] }
  }
  createdAt: any
  updatedAt: any
}

export async function getProviders(clinicId: string) {
  try {
    const session = await getServerSession()

    if (!session?.user) {
      throw new Error("Unauthorized")
    }

    const providersRef = adminDb.collection(`clinics/${clinicId}/providers`)
    const providersSnapshot = await providersRef.get()

    const providers: Provider[] = []

    providersSnapshot.forEach((doc) => {
      providers.push({
        id: doc.id,
        ...doc.data(),
      } as Provider)
    })

    return { providers }
  } catch (error) {
    console.error("Error fetching providers:", error)
    return { error: error.message || "Failed to fetch providers" }
  }
}

export async function createProvider(clinicId: string, providerData: Omit<Provider, "id" | "createdAt" | "updatedAt">) {
  try {
    const session = await getServerSession()

    if (!session?.user) {
      throw new Error("Unauthorized")
    }

    const now = new Date()

    const providerRef = adminDb.collection(`clinics/${clinicId}/providers`).doc()
    await providerRef.set({
      ...providerData,
      createdAt: now,
      updatedAt: now,
    })

    // Log the action
    await logAuditAction(clinicId, {
      userId: session.user.id as string,
      action: "create",
      resource: "provider",
      details: `Created provider: ${providerData.firstName} ${providerData.lastName}`,
      ipAddress: "0.0.0.0", // Server action doesn't have access to IP
      userAgent: "Server Action",
    })

    revalidatePath(`/dashboard/providers`)

    return {
      success: true,
      providerId: providerRef.id,
      message: `Provider ${providerData.firstName} ${providerData.lastName} added successfully`,
    }
  } catch (error) {
    console.error("Error creating provider:", error)
    return { error: error.message || "Failed to create provider" }
  }
}

export async function updateProvider(
  clinicId: string,
  providerId: string,
  providerData: Partial<Omit<Provider, "id" | "createdAt" | "updatedAt">>,
) {
  try {
    const session = await getServerSession()

    if (!session?.user) {
      throw new Error("Unauthorized")
    }

    const providerRef = adminDb.collection(`clinics/${clinicId}/providers`).doc(providerId)

    await providerRef.update({
      ...providerData,
      updatedAt: new Date(),
    })

    // Log the action
    await logAuditAction(clinicId, {
      userId: session.user.id as string,
      action: "update",
      resource: "provider",
      details: `Updated provider: ${providerId}`,
      ipAddress: "0.0.0.0",
      userAgent: "Server Action",
    })

    revalidatePath(`/dashboard/providers`)

    return {
      success: true,
      message: "Provider updated successfully",
    }
  } catch (error) {
    console.error("Error updating provider:", error)
    return { error: error.message || "Failed to update provider" }
  }
}

export async function deleteProvider(clinicId: string, providerId: string) {
  try {
    const session = await getServerSession()

    if (!session?.user) {
      throw new Error("Unauthorized")
    }

    const providerRef = adminDb.collection(`clinics/${clinicId}/providers`).doc(providerId)
    await providerRef.delete()

    // Log the action
    await logAuditAction(clinicId, {
      userId: session.user.id as string,
      action: "delete",
      resource: "provider",
      details: `Deleted provider ID: ${providerId}`,
      ipAddress: "0.0.0.0",
      userAgent: "Server Action",
    })

    revalidatePath(`/dashboard/providers`)

    return {
      success: true,
      message: "Provider deleted successfully",
    }
  } catch (error) {
    console.error("Error deleting provider:", error)
    return { error: error.message || "Failed to delete provider" }
  }
}

// Helper function for audit logging
async function logAuditAction(clinicId: string, data: any) {
  try {
    const id = crypto.randomUUID()
    const timestamp = Date.now()

    const auditLog = {
      ...data,
      id,
      timestamp,
      success: data.success !== undefined ? data.success : true,
    }

    // Store in clinic-specific audit logs
    const logRef = adminDb.collection(`clinics/${clinicId}/logs`).doc(id)
    await logRef.set(auditLog)

    // Also store in global audit logs for super admin access
    const globalLogRef = adminDb.collection("auditLogs").doc(id)
    await globalLogRef.set({
      ...auditLog,
      clinicId,
    })
  } catch (error) {
    console.error("Failed to write audit log:", error)
    // We don't want to throw here as it could disrupt the main operation
  }
}
