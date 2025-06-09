"use client"

import { useSession } from "next-auth/react"
import { hasPermission, type PermissionAction, type ResourceType } from "@/lib/permissions"
import type { UserRole } from "@/lib/role-permissions"

export function usePermissions() {
  const { data: session } = useSession()

  // @ts-ignore - role might not be in the session type
  const userRole = session?.user?.role as UserRole | undefined
  // @ts-ignore - clinicId might not be in the session type
  const userClinicId = session?.user?.clinicId as string | undefined

  const checkPermission = (
    action: PermissionAction,
    resource: ResourceType,
    scope: "own" | "clinic" | "all" = "own",
  ): boolean => {
    return hasPermission(userRole, action, resource, scope)
  }

  return {
    userRole,
    userClinicId,
    checkPermission,
    isAuthenticated: !!session,
    isSuperAdmin: userRole === "SUPER_ADMIN",
    isClinicOwner: userRole === "CLINIC_OWNER",
    isAdmin: userRole === "ADMIN",
    isMedicalStaff: userRole === "MEDICAL_STAFF",
    isReceptionist: userRole === "RECEPTIONIST",
    isClinicStaff: ["CLINIC_OWNER", "ADMIN", "MEDICAL_STAFF", "RECEPTIONIST"].includes(userRole || ""),
  }
}
