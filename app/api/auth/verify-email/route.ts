import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const oobCode = searchParams.get("oobCode")

    if (!oobCode) {
      return NextResponse.redirect(new URL("/login?error=invalid_verification", request.url))
    }

    // In a real app, this would verify the code with Firebase
    // For now, we'll simulate a successful verification

    return NextResponse.redirect(new URL("/login?verified=true", request.url))
  } catch (error: any) {
    console.error("Error in verify-email route:", error)
    return NextResponse.redirect(new URL("/login?error=verification_failed", request.url))
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 })
    }

    // In a real app, this would send a verification email via Firebase
    // For now, we'll simulate a successful send

    return NextResponse.json({
      success: true,
      message: "Verification email sent successfully",
    })
  } catch (error: any) {
    console.error("Error sending verification email:", error)
    return NextResponse.json(
      { success: false, message: error.message || "Failed to send verification email" },
      { status: 500 },
    )
  }
}
