import { getServerSession } from "next-auth/next"
import { type NextRequest, NextResponse } from "next/server"
import { redirect } from "next/navigation"

// Auth function for server components
export async function requireAuth() {
  const session = await getServerSession()

  if (!session) {
    redirect("/login?error=unauthorized")
  }

  return session
}

// Auth function for API routes
export async function requireAuthApi(req: NextRequest) {
  const session = await getServerSession()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  return session
}

// Super admin check for server components
export async function requireSuperAdmin() {
  const session = await getServerSession()

  if (!session) {
    redirect("/login?error=unauthorized")
  }

  // @ts-ignore - role might not be in the session type
  if (session.user?.role !== "SUPER_ADMIN") {
    redirect("/dashboard?error=permission")
  }

  return session
}

// Super admin check for API routes
export async function requireSuperAdminApi(req: NextRequest) {
  const session = await getServerSession()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // @ts-ignore - role might not be in the session type
  if (session.user?.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Permission denied" }, { status: 403 })
  }

  return session
}
