import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { notificationService } from "@/services/notification-service"
import { auditService } from "@/services/audit-service"

export async function GET(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)

    if (!session || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get clinic ID from session
    const clinicId = session.user.clinicId

    if (!clinicId) {
      return NextResponse.json({ error: "No clinic associated with user" }, { status: 400 })
    }

    // Parse query parameters
    const url = new URL(request.url)
    const type = url.searchParams.get("type") as "sms" | "email" | "push" | undefined

    // Get templates
    const templates = await notificationService.getClinicReminderTemplates(clinicId, type)

    return NextResponse.json(templates)
  } catch (error) {
    console.error("Error getting reminder templates:", error)
    return NextResponse.json({ error: "Failed to get reminder templates" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)

    if (!session || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get clinic ID from session
    const clinicId = session.user.clinicId

    if (!clinicId) {
      return NextResponse.json({ error: "No clinic associated with user" }, { status: 400 })
    }

    // Get template data from request
    const body = await request.json()
    const { name, type, subject, content, variables } = body

    if (!name || !type || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create template
    const template = await notificationService.createReminderTemplate(clinicId, {
      name,
      type,
      subject,
      content,
      variables: variables || [],
    })

    // Log the action
    await auditService.logAction(clinicId, {
      userId: session.user.id,
      action: "create",
      resource: "reminderTemplate",
      details: `Created reminder template: ${name}`,
      ipAddress: auditService.getClientIp(request),
      userAgent: auditService.getUserAgent(request),
    })

    return NextResponse.json(template)
  } catch (error) {
    console.error("Error creating reminder template:", error)
    return NextResponse.json({ error: "Failed to create reminder template" }, { status: 500 })
  }
}
