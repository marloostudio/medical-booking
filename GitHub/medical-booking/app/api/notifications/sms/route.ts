import { type NextRequest, NextResponse } from "next/server"
import { requirePermissionApi } from "@/lib/auth-utils"
import { Twilio } from "twilio"
import { auditService } from "@/services/audit-service"

const twilioClient =
  process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
    ? new Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
    : null

export async function POST(request: NextRequest) {
  try {
    const authResult = await requirePermissionApi(request, "create", "notifications", "clinic")
    if (authResult instanceof NextResponse) return authResult

    const { session, userClinicId } = authResult
    const { to, message, clinicId: requestClinicId } = await request.json()

    const clinicId = requestClinicId || userClinicId

    if (!clinicId) {
      return NextResponse.json({ error: "Clinic ID required" }, { status: 400 })
    }

    if (!to || !message) {
      return NextResponse.json({ error: "Phone number and message are required" }, { status: 400 })
    }

    if (!twilioClient) {
      return NextResponse.json({ error: "SMS service not configured" }, { status: 500 })
    }

    // Validate phone number format
    let phoneNumber = to
    if (!phoneNumber.startsWith("+")) {
      phoneNumber = `+${phoneNumber.replace(/\D/g, "")}`
    }

    // Send SMS via Twilio
    const result = await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    })

    // Log the action
    await auditService.logAction(clinicId, {
      userId: session.user.id,
      action: "create",
      resource: "sms",
      details: `SMS sent to ${phoneNumber}: ${message.substring(0, 50)}${message.length > 50 ? "..." : ""}`,
      ipAddress: auditService.getClientIp(request),
      userAgent: auditService.getUserAgent(request),
    })

    return NextResponse.json({
      success: true,
      sid: result.sid,
      message: "SMS sent successfully",
    })
  } catch (error) {
    console.error("Error sending SMS:", error)
    return NextResponse.json({ error: "Failed to send SMS" }, { status: 500 })
  }
}
