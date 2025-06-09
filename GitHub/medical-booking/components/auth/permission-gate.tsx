"use client"

import type { ReactNode } from "react"
import { usePermissions } from "@/hooks/use-permissions"
import type { PermissionAction, ResourceType } from "@/lib/permissions"

interface PermissionGateProps {
  action: PermissionAction
  resource: ResourceType
  scope?: "own" | "clinic" | "all"
  fallback?: ReactNode
  children: ReactNode
}

export function PermissionGate({ action, resource, scope = "own", fallback = null, children }: PermissionGateProps) {
  const { checkPermission } = usePermissions()

  if (checkPermission(action, resource, scope)) {
    return <>{children}</>
  }

  return <>{fallback}</>
}
