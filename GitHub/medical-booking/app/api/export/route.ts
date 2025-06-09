import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { dataExportService, type ExportOptions } from "@/services/data-export-service"
import { auditService } from "@/services/audit-service"

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)

    if (!session || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Only allow CLINIC_OWNER, ADMIN, or SUPER_ADMIN to export data
    if (!["CLINIC_OWNER", "ADMIN", "SUPER_ADMIN"].includes(session.user.role)) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    // Get export options from request
    const options: ExportOptions = await request.json()

    // Perform the export
    const result = await dataExportService.exportClinicData(session.user.clinicId, session.user.id, options)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    // Log the successful export
    await auditService.logAction(session.user.clinicId, {
      userId: session.user.id,
      action: "export",
      resource: "clinic_data",
      details: "Data export completed successfully",
      ipAddress: auditService.getClientIp(request),
      userAgent: auditService.getUserAgent(request),
    })

    // Set appropriate headers based on format and encryption
    const headers: HeadersInit = {}

    if (result.format === "csv") {
      headers["Content-Type"] = "text/csv"
      headers["Content-Disposition"] =
        `attachment; filename="clinic-export-${new Date().toISOString().split("T")[0]}.csv"`
    } else {
      headers["Content-Type"] = "application/json"
      headers["Content-Disposition"] =
        `attachment; filename="clinic-export-${new Date().toISOString().split("T")[0]}.json"`
    }

    if (result.encrypted) {
      headers["X-Encrypted"] = "true"
    }

    return new NextResponse(result.data, {
      status: 200,
      headers,
    })
  } catch (error) {
    console.error("Error processing export request:", error)
    return NextResponse.json({ error: "Failed to export data", details: String(error) }, { status: 500 })
  }
}
