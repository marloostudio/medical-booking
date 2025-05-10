import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { adminDb } from "@/lib/firebase-admin"
import { auditService } from "@/services/audit-service"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import speakeasy from "speakeasy"

// Simple in-memory rate limiting
const rateLimitStore: Record<string, { count: number; resetAt: number }> = {}

// Rate limit configuration
const MAX_ATTEMPTS = 5
const WINDOW_MS = 15 * 60 * 1000 // 15 minutes

function isRateLimited(userId: string): boolean {
  const now = Date.now()
  const userRateLimit = rateLimitStore[userId]

  // Clear expired rate limit entries
  if (userRateLimit && userRateLimit.resetAt < now) {
    delete rateLimitStore[userId]
    return false
  }

  // Check if user is rate limited
  if (userRateLimit && userRateLimit.count >= MAX_ATTEMPTS) {
    return true
  }

  // Initialize or increment rate limit counter
  if (!userRateLimit) {
    rateLimitStore[userId] = { count: 1, resetAt: now + WINDOW_MS }
  } else {
    userRateLimit.count++
  }

  return false
}

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)

    if (!session || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    // Check rate limiting
    if (isRateLimited(userId)) {
      // Log rate limit event
      await auditService.logAction(session.user.clinicId || "system", {
        userId,
        action: "error",
        resource: "mfa",
        details: "Rate limit exceeded for MFA verification",
        ipAddress: auditService.getClientIp(request),
        userAgent: auditService.getUserAgent(request),
      })

      return NextResponse.json({ error: "Too many verification attempts. Please try again later." }, { status: 429 })
    }

    // Get token from request
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 })
    }

    // Get the secret from temporary storage
    const setupDoc = await adminDb.collection("users").doc(userId).collection("mfa").doc("setup").get()

    if (!setupDoc.exists) {
      return NextResponse.json({ error: "MFA setup not found" }, { status: 404 })
    }

    const { secret } = setupDoc.data() || {}

    // Verify the token
    const verified = speakeasy.totp.verify({
      secret,
      encoding: "base32",
      token,
      window: 1, // Allow 1 period before/after for clock drift
    })

    if (!verified) {
      // Log failed verification attempt
      await auditService.logAction(session.user.clinicId || "system", {
        userId,
        action: "error",
        resource: "mfa",
        details: "Failed MFA verification attempt",
        ipAddress: auditService.getClientIp(request),
        userAgent: auditService.getUserAgent(request),
      })

      return NextResponse.json({ error: "Invalid token" }, { status: 400 })
    }

    // Store the verified secret permanently
    await adminDb.collection("users").doc(userId).update({
      mfaEnabled: true,
      mfaSecret: secret,
    })

    // Delete the temporary setup document
    await adminDb.collection("users").doc(userId).collection("mfa").doc("setup").delete()

    // Reset rate limit for successful verification
    delete rateLimitStore[userId]

    // Log MFA setup completion
    await auditService.logAction(session.user.clinicId || "system", {
      userId,
      action: "update",
      resource: "mfa",
      details: "MFA setup completed",
      ipAddress: auditService.getClientIp(request),
      userAgent: auditService.getUserAgent(request),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error verifying MFA:", error)
    return NextResponse.json({ error: "Failed to verify MFA" }, { status: 500 })
  }
}
