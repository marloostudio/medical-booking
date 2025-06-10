import "server-only"
import { getServerSession } from "next-auth"
import { type NextRequest, NextResponse } from "next/server"
import { redirect } from "next/navigation"
import { hasPermission, type PermissionAction, type ResourceType } from "./permissions"
import type { UserRole } from "./role-permissions"

// Auth function for server components
export async function requireAuth() {
  const session = await getServerSession()

  if (!session?.user) {
    redirect("/login")
  }

  return session
}

export async function requireRole(allowedRoles: string[]) {
  const session = await requireAuth()

  if (!allowedRoles.includes(session.user.role)) {
    redirect("/dashboard")
  }

  return session
}

// Auth function with resource permission check for server components
export async function requirePermission(
  action: PermissionAction,
  resource: ResourceType,
  scope: "own" | "clinic" | "all" = "own",
) {
  const session = await getServerSession()

  if (!session) {
    redirect("/login?error=unauthorized")
  }

  // @ts-ignore - role might not be in the session type
  const userRole = session.user?.role as UserRole | undefined
  // @ts-ignore - clinicId might not be in the session type
  const userClinicId = session.user?.clinicId as string | undefined

  if (!hasPermission(userRole, action, resource, scope)) {
    redirect("/dashboard?error=permission")
  }

  return { session, userRole, userClinicId }
}

// Auth function for API routes
export async function requireAuthApi(req: NextRequest) {
  const session = await getServerSession()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  return session
}

// Auth function with resource permission check for API routes
export async function requirePermissionApi(
  req: NextRequest,
  action: PermissionAction,
  resource: ResourceType,
  scope: "own" | "clinic" | "all" = "own",
) {
  const session = await getServerSession()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // @ts-ignore - role might not be in the session type
  const userRole = session.user?.role as UserRole | undefined
  // @ts-ignore - clinicId might not be in the session type
  const userClinicId = session.user?.clinicId as string | undefined

  if (!hasPermission(userRole, action, resource, scope)) {
    return NextResponse.json({ error: "Permission denied" }, { status: 403 })
  }

  return { session, userRole, userClinicId }
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

// Clinic owner check for server components
export async function requireClinicOwner() {
  const session = await getServerSession()

  if (!session) {
    redirect("/login?error=unauthorized")
  }

  // @ts-ignore - role might not be in the session type
  if (session.user?.role !== "CLINIC_OWNER" && session.user?.role !== "SUPER_ADMIN") {
    redirect("/dashboard?error=permission")
  }

  return session
}

// Clinic owner check for API routes
export async function requireClinicOwnerApi(req: NextRequest) {
  const session = await getServerSession()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // @ts-ignore - role might not be in the session type
  if (session.user?.role !== "CLINIC_OWNER" && session.user?.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Permission denied" }, { status: 403 })
  }

  return session
}

// Check if user belongs to a specific clinic
export async function requireClinicMembership(clinicId: string) {
  const session = await getServerSession()

  if (!session) {
    redirect("/login?error=unauthorized")
  }

  // @ts-ignore - clinicId might not be in the session type
  const userClinicId = session.user?.clinicId as string | undefined
  // @ts-ignore - role might not be in the session type
  const userRole = session.user?.role as UserRole | undefined

  // Super admins can access any clinic
  if (userRole === "SUPER_ADMIN") {
    return session
  }

  if (!userClinicId || userClinicId !== clinicId) {
    redirect("/dashboard?error=wrong-clinic")
  }

  return session
}

// Check if user belongs to a specific clinic for API routes
export async function requireClinicMembershipApi(req: NextRequest, clinicId: string) {
  const session = await getServerSession()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // @ts-ignore - clinicId might not be in the session type
  const userClinicId = session.user?.clinicId as string | undefined
  // @ts-ignore - role might not be in the session type
  const userRole = session.user?.role as UserRole | undefined

  // Super admins can access any clinic
  if (userRole === "SUPER_ADMIN") {
    return session
  }

  if (!userClinicId || userClinicId !== clinicId) {
    return NextResponse.json({ error: "Wrong clinic" }, { status: 403 })
  }

  return session
}
