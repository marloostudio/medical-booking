import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { adminDb } from "@/lib/firebase-admin"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { emailService } from "@/services/email-service"

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)

    if (!session || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get request body
    const { clinicId, to, subject, html, text, templateId, templateData } = await request.json()

    if (!clinicId || !to || (!subject && !templateId)) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if user has access to this clinic
    if (session.user.role !== "SUPER_ADMIN" && session.user.clinicId !== clinicId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    let emailSubject = subject
    let emailHtml = html
    let emailText = text

    // If using a template
    if (templateId) {
      // Get template
      const templateDoc = await adminDb
        .collection("clinics")
        .doc(clinicId)
        .collection("emailTemplates")
        .doc(templateId)
        .get()

      if (!templateDoc.exists) {
        return NextResponse.json({ error: "Template not found" }, { status: 404 })
      }

      const template = templateDoc.data()

      // Replace template variables with data
      emailSubject = template.subject
      emailHtml = template.html
      emailText = template.text

      if (templateData) {
        Object.entries(templateData).forEach(([key, value]) => {
          const regex = new RegExp(`{{${key}}}`, "g")
          emailSubject = emailSubject.replace(regex, value as string)
          emailHtml = emailHtml.replace(regex, value as string)
          emailText = emailText.replace(regex, value as string)
        })
      }
    }

    // Send email
    const result = await emailService.sendEmail(
      to,
      emailSubject,
      emailHtml,
      emailText || emailHtml.replace(/<[^>]*>/g, ""),
      "noreply@thebookinglink.com",
      session.user.id,
      clinicId,
    )

    if (!result) {
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error sending email:", error)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}
