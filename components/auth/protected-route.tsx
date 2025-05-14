"use client"

import type React from "react"
import type { UserRole } from "@/lib/role-permissions"
import { hasPermission } from "@/lib/role-permissions"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface ProtectedRouteProps {
  children: React.ReactNode
  requireSuperAdmin?: boolean
  resource?: string
  action?: "view" | "create" | "update" | "delete"
}

export default function ProtectedRoute({
  children,
  requireSuperAdmin = false,
  resource,
  action = "view",
}: ProtectedRouteProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push("/login?error=unauthorized")
      return
    }

    // @ts-ignore - role might not be in the session type
    if (requireSuperAdmin && session.user?.role !== "SUPER_ADMIN") {
      router.push("/dashboard?error=permission")
      return
    }

    // Check resource permission if specified
    if (resource) {
      // @ts-ignore - role might not be in the session type
      const userRole = session.user?.role as UserRole | undefined
      if (!hasPermission(userRole, resource, action)) {
        router.push("/dashboard?error=permission")
      }
    }
  }, [session, status, router, requireSuperAdmin, resource, action])

  if (status === "loading") {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  // @ts-ignore - role might not be in the session type
  if (requireSuperAdmin && session?.user?.role !== "SUPER_ADMIN") {
    return null
  }

  // Check resource permission if specified
  if (resource && session) {
    // @ts-ignore - role might not be in the session type
    const userRole = session.user?.role as UserRole | undefined
    if (!hasPermission(userRole, resource, action)) {
      return null
    }
  }

  if (!session) {
    return null
  }

  return <>{children}</>
}
