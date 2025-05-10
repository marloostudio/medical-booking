import { type NextRequest, NextResponse } from "next/server"
import { adminDb } from "@/lib/firebase-admin-server"
import { getServerSession } from "next-auth"
import { auditService } from "@/services/audit-service"

export async function GET(request: NextRequest, { params }: { params: { clinicId: string; providerId: string } }) {
  try {
    const session = await getServerSession()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { clinicId, providerId } = params

    // Verify user has access to this clinic
    // @ts-ignore - clinicId might not be in the session type
    const userClinicId = session.user?.clinicId as string | undefined
    // @ts-ignore - role might not be in the session type
    const userRole = session.user?.role as string | undefined

    if (userRole !== "SUPER_ADMIN" && userClinicId !== clinicId) {
      return NextResponse.json({ error: "Access denied to this clinic" }, { status: 403 })
    }

    const providerRef = adminDb.collection(`clinics/${clinicId}/providers`).doc(providerId)
    const providerDoc = await providerRef.get()

    if (!providerDoc.exists) {
      return NextResponse.json({ error: "Provider not found" }, { status: 404 })
    }

    return NextResponse.json({
      provider: {
        id: providerDoc.id,
        ...providerDoc.data(),
      },
    })
  } catch (error) {
    console.error("Error fetching provider:", error)
    return NextResponse.json({ error: "Failed to fetch provider" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { clinicId: string; providerId: string } }) {
  try {
    const session = await getServerSession()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { clinicId, providerId } = params

    // Verify user has access to this clinic
    // @ts-ignore - clinicId might not be in the session type
    const userClinicId = session.user?.clinicId as string | undefined
    // @ts-ignore - role might not be in the session type
    const userRole = session.user?.role as string | undefined

    if (userRole !== "SUPER_ADMIN" && userClinicId !== clinicId) {
      return NextResponse.json({ error: "Access denied to this clinic" }, { status: 403 })
    }

    const providerData = await request.json()

    // Update the provider document
    const providerRef = adminDb.collection(`clinics/${clinicId}/providers`).doc(providerId)
    await providerRef.update({
      ...providerData,
      updatedAt: new Date(),
    })

    // Log the action
    await auditService.logAction(clinicId, {
      userId: session.user.id,
      action: "update",
      resource: "provider",
      details: `Updated provider: ${providerId}`,
      ipAddress: auditService.getClientIp(request),
      userAgent: auditService.getUserAgent(request),
    })

    return NextResponse.json({
      success: true,
      message: "Provider updated successfully",
    })
  } catch (error) {
    console.error("Error updating provider:", error)
    return NextResponse.json({ error: "Failed to update provider" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { clinicId: string; providerId: string } }) {
  try {
    const session = await getServerSession()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { clinicId, providerId } = params

    // Verify user has access to this clinic
    // @ts-ignore - clinicId might not be in the session type
    const userClinicId = session.user?.clinicId as string | undefined
    // @ts-ignore - role might not be in the session type
    const userRole = session.user?.role as string | undefined

    if (userRole !== "SUPER_ADMIN" && userClinicId !== clinicId) {
      return NextResponse.json({ error: "Access denied to this clinic" }, { status: 403 })
    }

    // Delete the provider document
    const providerRef = adminDb.collection(`clinics/${clinicId}/providers`).doc(providerId)
    await providerRef.delete()

    // Log the action
    await auditService.logAction(clinicId, {
      userId: session.user.id,
      action: "delete",
      resource: "provider",
      details: `Deleted provider ID: ${providerId}`,
      ipAddress: auditService.getClientIp(request),
      userAgent: auditService.getUserAgent(request),
    })

    return NextResponse.json({
      success: true,
      message: "Provider deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting provider:", error)
    return NextResponse.json({ error: "Failed to delete provider" }, { status: 500 })
  }
}
