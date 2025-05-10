import { type NextRequest, NextResponse } from "next/server"
import { requirePermissionApi } from "@/lib/auth-utils"
import sgMail from "@sendgrid/mail"
import { auditService } from "@/services/audit-service"

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY || "")

export async function POST(request: NextRequest) {
  try {
    const authResult = await requirePermissionApi(request, "create", "notifications", "clinic")
    if (authResult instanceof NextResponse) return authResult

    const { session, userClinicId } = authResult
    const { to, subject, html, text, from, clinicId: requestClinicId } = await request.json()

    const clinicId = requestClinicId || userClinicId

    if (!clinicId) {
      return NextResponse.json({ error: "Clinic ID required" }, { status: 400 })
    }

    if (!to || !subject || (!html && !text)) {
      return NextResponse.json({ error: "Email address, subject, and content are required" }, { status: 400 })
    }

    const msg = {
      to,
      from: from || "noreply@thebookinglink.com",
      subject,
      text: text || "",
      html: html || "",
    }

    await sgMail.send(msg)

    // Log the action
    await auditService.logAction(clinicId, {
      userId: session.user.id,
      action: "create",
      resource: "email",
      details: `Email sent to ${to}: ${subject}`,
      ipAddress: auditService.getClientIp(request),
      userAgent: auditService.getUserAgent(request),
    })

    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
    })
  } catch (error) {
    console.error("Error sending email:", error)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}
