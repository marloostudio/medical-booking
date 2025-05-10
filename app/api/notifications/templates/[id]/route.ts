import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { notificationService } from "@/services/notification-service"
import { auditService } from "@/services/audit-service"

export async function GET(request: Request, { params }: { params: { id: string } }) {
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

    // Get template ID from params
    const templateId = params.id

    // Get templates
    const templates = await notificationService.getClinicReminderTemplates(clinicId)
    const template = templates.find((t) => t.id === templateId)

    if (!template) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 })
    }

    return NextResponse.json(template)
  } catch (error) {
    console.error("Error getting reminder template:", error)
    return NextResponse.json({ error: "Failed to get reminder template" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
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

    // Get template ID from params
    const templateId = params.id

    // Get template data from request
    const body = await request.json()
    const { name, subject, content, variables } = body

    // Update template
    await notificationService.updateReminderTemplate(clinicId, templateId, {
      name,
      subject,
      content,
      variables,
    })

    // Log the action
    await auditService.logAction(clinicId, {
      userId: session.user.id,
      action: "update",
      resource: "reminderTemplate",
      details: `Updated reminder template: ${templateId}`,
      ipAddress: auditService.getClientIp(request),
      userAgent: auditService.getUserAgent(request),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating reminder template:", error)
    return NextResponse.json({ error: "Failed to update reminder template" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
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

    // Get template ID from params
    const templateId = params.id

    // Delete template
    // For this implementation, we'll just mark it as deleted
    await notificationService.updateReminderTemplate(clinicId, templateId, {
      deleted: true,
    })

    // Log the action
    await auditService.logAction(clinicId, {
      userId: session.user.id,
      action: "delete",
      resource: "reminderTemplate",
      details: `Deleted reminder template: ${templateId}`,
      ipAddress: auditService.getClientIp(request),
      userAgent: auditService.getUserAgent(request),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting reminder template:", error)
    return NextResponse.json({ error: "Failed to delete reminder template" }, { status: 500 })
  }
}
