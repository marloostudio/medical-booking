"use client"

import type React from "react"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface ProtectedRouteProps {
  children: React.ReactNode
  requireSuperAdmin?: boolean
}

export default function ProtectedRoute({ children, requireSuperAdmin = false }: ProtectedRouteProps) {
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
    }
  }, [session, status, router, requireSuperAdmin])

  if (status === "loading") {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  // @ts-ignore - role might not be in the session type
  if (requireSuperAdmin && session?.user?.role !== "SUPER_ADMIN") {
    return null
  }

  if (!session) {
    return null
  }

  return <>{children}</>
}
