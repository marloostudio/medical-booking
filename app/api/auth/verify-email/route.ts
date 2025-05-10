import { type NextRequest, NextResponse } from "next/server"
import { verificationService } from "@/services/verification-service"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const mode = searchParams.get("mode")
    const oobCode = searchParams.get("oobCode")

    if (mode !== "verifyEmail" || !oobCode) {
      return NextResponse.redirect(new URL("/login?error=invalid_verification", request.url))
    }

    const result = await verificationService.verifyEmail(oobCode)

    if (result.success) {
      return NextResponse.redirect(new URL("/login?verified=true", request.url))
    } else {
      return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(result.message)}`, request.url))
    }
  } catch (error: any) {
    console.error("Error in verify-email route:", error)
    return NextResponse.redirect(new URL("/login?error=verification_failed", request.url))
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 })
    }

    const result = await verificationService.sendEmailVerification(userId)

    return NextResponse.json(result)
  } catch (error: any) {
    console.error("Error in verify-email route:", error)
    return NextResponse.json(
      { success: false, message: error.message || "Failed to process verification request" },
      { status: 500 },
    )
  }
}
