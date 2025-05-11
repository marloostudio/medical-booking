import { type NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

export async function superAdminMiddleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  // Check if user is authenticated and has super admin role
  if (!token || token.role !== "SUPER_ADMIN") {
    return NextResponse.redirect(new URL("/login?error=unauthorized&message=Super+admin+access+required", req.url))
  }

  return NextResponse.next()
}
