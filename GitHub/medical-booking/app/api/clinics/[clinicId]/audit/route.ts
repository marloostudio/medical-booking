import { type NextRequest, NextResponse } from "next/server"
import { adminDb } from "@/lib/firebase-admin-server"
import { getServerSession } from "next-auth"
import { v4 as uuidv4 } from "uuid"

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

    const { searchParams } = new URL(request.url)

    // Build query
    let auditQuery = adminDb.collection(`clinics/${clinicId}/logs`)

    // Add filters
    const userId = searchParams.get("userId")
    if (userId) {
      auditQuery = auditQuery.where("userId", "==", userId)
    }

    const action = searchParams.get("action")
    if (action) {
      auditQuery = auditQuery.where("action", "==", action)
    }

    const resource = searchParams.get("resource")
    if (resource) {
      auditQuery = auditQuery.where("resource", "==", resource)
    }

    const resourceId = searchParams.get("resourceId")
    if (resourceId) {
      auditQuery = auditQuery.where("resourceId", "==", resourceId)
    }

    // Add ordering
    auditQuery = auditQuery.orderBy("timestamp", "desc")

    // Add limit
    const limitParam = searchParams.get("limit")
    if (limitParam) {
      const limitValue = Number.parseInt(limitParam, 10)
      if (!isNaN(limitValue)) {
        auditQuery = auditQuery.limit(limitValue)
      }
    }

    // Execute query
    const snapshot = await auditQuery.get()

    const logs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    return NextResponse.json({ logs })
  } catch (error) {
    console.error("Error fetching audit logs:", error)
    return NextResponse.json({ error: "Failed to fetch audit logs" }, { status: 500 })
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

    const data = await request.json()

    // Validate required fields
    if (!data.action || !data.resource) {
      return NextResponse.json({ error: "Missing required fields: action and resource" }, { status: 400 })
    }

    // Generate ID and timestamp
    const id = uuidv4()
    const timestamp = Date.now()

    // Get client IP and user agent
    const forwarded = request.headers.get("x-forwarded-for")
    const ipAddress = (forwarded && typeof forwarded === "string" ? forwarded.split(/, /)[0] : null) || "0.0.0.0"
    const userAgent = request.headers.get("user-agent") || "Unknown"

    // Create log entry
    const logEntry = {
      id,
      timestamp,
      userId: session.user.id,
      action: data.action,
      resource: data.resource,
      resourceId: data.resourceId,
      details: data.details,
      ipAddress,
      userAgent,
      success: data.success !== undefined ? data.success : true,
      metadata: data.metadata,
    }

    // Save to clinic-specific audit logs
    await adminDb.collection(`clinics/${clinicId}/logs`).doc(id).set(logEntry)

    // Also save to global audit logs for super admin access
    await adminDb
      .collection(`auditLogs`)
      .doc(id)
      .set({
        ...logEntry,
        clinicId,
      })

    return NextResponse.json({ success: true, message: "Audit log created" }, { status: 201 })
  } catch (error) {
    console.error("Error creating audit log:", error)
    return NextResponse.json({ error: "Failed to create audit log" }, { status: 500 })
  }
}
