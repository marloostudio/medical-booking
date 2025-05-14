import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { notificationService } from "@/services/notification-service"
import { parseISO } from "date-fns"

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
    const startDateParam = url.searchParams.get("startDate")
    const endDateParam = url.searchParams.get("endDate")
    const patientId = url.searchParams.get("patientId")
    const appointmentId = url.searchParams.get("appointmentId")
    const status = url.searchParams.get("status") as "sent" | "delivered" | "failed" | "responded" | undefined

    // Parse dates if provided
    const startDate = startDateParam ? parseISO(startDateParam) : undefined
    const endDate = endDateParam ? parseISO(endDateParam) : undefined

    // Get reminder logs
    const logs = await notificationService.getReminderLogs(clinicId, {
      patientId: patientId || undefined,
      appointmentId: appointmentId || undefined,
      status,
      startDate,
      endDate,
    })

    // Calculate analytics
    const totalReminders = logs.length
    const deliveredCount = logs.filter((log) => log.status === "delivered" || log.status === "responded").length
    const failedCount = logs.filter((log) => log.status === "failed").length
    const respondedCount = logs.filter((log) => log.status === "responded").length

    const responseTypes = {
      confirm: logs.filter((log) => log.response === "confirm").length,
      cancel: logs.filter((log) => log.response === "cancel").length,
      reschedule: logs.filter((log) => log.response === "reschedule").length,
      none: logs.filter((log) => log.response === "none" || !log.response).length,
    }

    const channelBreakdown = {
      sms: logs.filter((log) => log.type === "sms").length,
      email: logs.filter((log) => log.type === "email").length,
      push: logs.filter((log) => log.type === "push").length,
    }

    // Calculate delivery rate and response rate
    const deliveryRate = totalReminders > 0 ? (deliveredCount / totalReminders) * 100 : 0
    const responseRate = deliveredCount > 0 ? (respondedCount / deliveredCount) * 100 : 0

    return NextResponse.json({
      totalReminders,
      deliveredCount,
      failedCount,
      respondedCount,
      deliveryRate,
      responseRate,
      responseTypes,
      channelBreakdown,
      logs,
    })
  } catch (error) {
    console.error("Error getting reminder analytics:", error)
    return NextResponse.json({ error: "Failed to get reminder analytics" }, { status: 500 })
  }
}
