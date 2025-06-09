import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { adminDb } from "@/lib/firebase-admin"
import { auditService } from "@/services/audit-service"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import speakeasy from "speakeasy"
import qrcode from "qrcode"

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)

    if (!session || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Generate a secret key
    const secret = speakeasy.generateSecret({
      name: `BookingLink:${session.user.email}`,
    })

    // Generate QR code
    const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url || "")

    // Store the secret temporarily (it will be verified and permanently stored later)
    await adminDb.collection("users").doc(session.user.id).collection("mfa").doc("setup").set({
      secret: secret.base32,
      createdAt: new Date().toISOString(),
    })

    // Log MFA setup initiation
    await auditService.logAction(session.user.clinicId || "system", {
      userId: session.user.id,
      action: "create",
      resource: "mfa",
      details: "MFA setup initiated",
      ipAddress: auditService.getClientIp(request),
      userAgent: auditService.getUserAgent(request),
    })

    return NextResponse.json({
      qrCode: qrCodeUrl,
      secret: secret.base32,
    })
  } catch (error) {
    console.error("Error setting up MFA:", error)
    return NextResponse.json({ error: "Failed to set up MFA" }, { status: 500 })
  }
}
