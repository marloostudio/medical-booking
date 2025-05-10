import { NextResponse } from "next/server"
import { notificationService } from "@/services/notification-service"
import { auditService } from "@/services/audit-service"

// This endpoint should be called by a cron job or scheduler
// For example, using Vercel Cron Jobs or a third-party service
export async function GET(request: Request) {
  try {
    // Verify the request is authorized
    // This is a simple example using a token in the query string
    // In production, you would use a more secure method
    const url = new URL(request.url)
    const token = url.searchParams.get("token")

    if (!token || token !== process.env.BACKUP_SECRET_TOKEN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Process scheduled reminders
    await notificationService.processScheduledReminders()

    // Log the successful processing
    await auditService.logAction("system", {
      userId: "system",
      action: "process",
      resource: "scheduledReminders",
      details: "Processed scheduled reminders",
      ipAddress: "0.0.0.0",
      userAgent: "CronJob",
    })

    return NextResponse.json({
      success: true,
      message: "Scheduled reminders processed successfully",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error processing scheduled reminders:", error)

    // Log the error
    await auditService.logAction("system", {
      userId: "system",
      action: "error",
      resource: "scheduledReminders",
      details: `Error processing scheduled reminders: ${error.message}`,
      ipAddress: "0.0.0.0",
      userAgent: "CronJob",
    })

    return NextResponse.json({ error: "Failed to process scheduled reminders" }, { status: 500 })
  }
}
