import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { adminDb } from "@/lib/firebase-admin"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)

    if (!session || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const clinicId = searchParams.get("clinicId") || session.user.clinicId

    if (!clinicId) {
      return NextResponse.json({ error: "Clinic ID is required" }, { status: 400 })
    }

    // Check if user has access to this clinic
    if (session.user.role !== "SUPER_ADMIN" && session.user.clinicId !== clinicId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Get email templates
    const templatesSnapshot = await adminDb.collection("clinics").doc(clinicId).collection("emailTemplates").get()

    const templates = []
    templatesSnapshot.forEach((doc) => {
      templates.push({
        id: doc.id,
        ...doc.data(),
      })
    })

    return NextResponse.json({ templates })
  } catch (error) {
    console.error("Error fetching email templates:", error)
    return NextResponse.json({ error: "Failed to fetch email templates" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)

    if (!session || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get request body
    const { clinicId, name, subject, html, text } = await request.json()

    if (!clinicId || !name || !subject || !html) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if user has access to this clinic
    if (session.user.role !== "SUPER_ADMIN" && session.user.clinicId !== clinicId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Create email template
    const templateRef = adminDb.collection("clinics").doc(clinicId).collection("emailTemplates").doc()

    await templateRef.set({
      name,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ""),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: session.user.id,
    })

    return NextResponse.json({
      id: templateRef.id,
      name,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ""),
    })
  } catch (error) {
    console.error("Error creating email template:", error)
    return NextResponse.json({ error: "Failed to create email template" }, { status: 500 })
  }
}
