import { NextResponse } from "next/server"
import { notificationService } from "@/services/notification-service"
import { auditService } from "@/services/audit-service"

export async function POST(request: Request) {
  try {
    // Parse the form data from Twilio
    const formData = await request.formData()

    const from = formData.get("From") as string
    const body = formData.get("Body") as string
    const messageSid = formData.get("MessageSid") as string

    if (!from || !body) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    // Extract clinic ID from the To number or use a lookup mechanism
    // For this implementation, we'll use a default clinic ID
    const clinicId = process.env.DEFAULT_CLINIC_ID || "demo-clinic"

    // Log the incoming message
    await auditService.logAction(clinicId, {
      userId: "system",
      action: "receive",
      resource: "sms",
      details: `Received SMS from ${from}: ${body}`,
      ipAddress: auditService.getClientIp(request),
      userAgent: auditService.getUserAgent(request),
    })

    // Process the SMS response
    const result = await notificationService.handleSmsResponse(from, body, clinicId)

    // Return TwiML response
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  ${result.success ? "" : `<Message>${result.message}</Message>`}
</Response>`

    return new NextResponse(twiml, {
      headers: {
        "Content-Type": "text/xml",
      },
    })
  } catch (error) {
    console.error("Error processing SMS webhook:", error)

    // Return a valid TwiML response even in case of error
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>Sorry, we encountered an error processing your message. Please contact the clinic directly.</Message>
</Response>`

    return new NextResponse(twiml, {
      headers: {
        "Content-Type": "text/xml",
      },
    })
  }
}
