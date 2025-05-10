import { type NextRequest, NextResponse } from "next/server"
import { adminDb } from "@/lib/firebase-admin-server"
import { getServerSession } from "next-auth"
import { auditService } from "@/services/audit-service"

export async function GET(request: NextRequest, { params }: { params: { clinicId: string } }) {
  try {
    const session = await getServerSession()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const clinicId = params.clinicId

    // Verify user has access to this clinic
    // @ts-ignore - clinicId might not be in the session type
    const userClinicId = session.user?.clinicId as string | undefined
    // @ts-ignore - role might not be in the session type
    const userRole = session.user?.role as string | undefined

    if (userRole !== "SUPER_ADMIN" && userClinicId !== clinicId) {
      return NextResponse.json({ error: "Access denied to this clinic" }, { status: 403 })
    }

    const providersRef = adminDb.collection(`clinics/${clinicId}/providers`)
    const providersSnapshot = await providersRef.get()

    const providers = providersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    return NextResponse.json({ providers })
  } catch (error) {
    console.error("Error fetching providers:", error)
    return NextResponse.json({ error: "Failed to fetch providers" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { clinicId: string } }) {
  try {
    const session = await getServerSession()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const clinicId = params.clinicId

    // Verify user has access to this clinic
    // @ts-ignore - clinicId might not be in the session type
    const userClinicId = session.user?.clinicId as string | undefined
    // @ts-ignore - role might not be in the session type
    const userRole = session.user?.role as string | undefined

    if (userRole !== "SUPER_ADMIN" && userClinicId !== clinicId) {
      return NextResponse.json({ error: "Access denied to this clinic" }, { status: 403 })
    }

    const providerData = await request.json()

    // Validate required fields
    if (!providerData.firstName || !providerData.lastName || !providerData.title) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const now = new Date()

    // Create the provider document
    const providerRef = adminDb.collection(`clinics/${clinicId}/providers`).doc()
    await providerRef.set({
      ...providerData,
      createdAt: now,
      updatedAt: now,
    })

    // Log the action
    await auditService.logAction(clinicId, {
      userId: session.user.id,
      action: "create",
      resource: "provider",
      details: `Created provider: ${providerData.firstName} ${providerData.lastName}`,
      ipAddress: auditService.getClientIp(request),
      userAgent: auditService.getUserAgent(request),
    })

    return NextResponse.json(
      {
        success: true,
        providerId: providerRef.id,
        message: `Provider ${providerData.firstName} ${providerData.lastName} added successfully`,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating provider:", error)
    return NextResponse.json({ error: "Failed to create provider" }, { status: 500 })
  }
}
