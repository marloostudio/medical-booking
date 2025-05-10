"use client"

// Client-safe audit service that uses API calls instead of direct Firebase access

export type AuditAction =
  | "create"
  | "read"
  | "update"
  | "delete"
  | "login"
  | "logout"
  | "error"
  | "view"
  | "export"
  | "import"
  | "verify"

export type AuditResource =
  | "auth"
  | "clinic"
  | "patient"
  | "appointment"
  | "staff"
  | "provider"
  | "mfa"
  | "email"
  | "sms"
  | "notification"
  | "backup"
  | "export"
  | "payment"
  | "subscription"
  | "settings"

export interface AuditLog {
  id: string
  userId: string
  action: AuditAction
  resource: AuditResource
  resourceId?: string
  details?: string
  ipAddress: string
  userAgent: string
  timestamp: number
  success: boolean
  metadata?: Record<string, any>
}

export interface AuditQuery {
  clinicId: string
  userId?: string
  action?: AuditAction
  resource?: AuditResource
  resourceId?: string
  startDate?: Date
  endDate?: Date
  limit?: number
}

export const clientAuditService = {
  async logAction(
    clinicId: string,
    data: {
      action: AuditAction
      resource: AuditResource
      resourceId?: string
      details?: string
      success?: boolean
      metadata?: Record<string, any>
    },
  ): Promise<void> {
    try {
      const response = await fetch(`/api/clinics/${clinicId}/audit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          success: data.success !== undefined ? data.success : true,
        }),
      })

      if (!response.ok) {
        console.error("Failed to log audit action:", await response.text())
      }
    } catch (error) {
      console.error("Failed to write audit log:", error)
      // Don't throw here as it could disrupt the main operation
    }
  },

  async queryAuditLogs(query: AuditQuery): Promise<AuditLog[]> {
    try {
      const { clinicId, userId, action, resource, resourceId, startDate, endDate, limit } = query

      const searchParams = new URLSearchParams()

      if (userId) searchParams.append("userId", userId)
      if (action) searchParams.append("action", action)
      if (resource) searchParams.append("resource", resource)
      if (resourceId) searchParams.append("resourceId", resourceId)
      if (startDate) searchParams.append("startDate", startDate.toISOString())
      if (endDate) searchParams.append("endDate", endDate.toISOString())
      if (limit) searchParams.append("limit", limit.toString())

      const response = await fetch(`/api/clinics/${clinicId}/audit?${searchParams.toString()}`)

      if (!response.ok) {
        throw new Error("Failed to fetch audit logs")
      }

      const data = await response.json()
      return data.logs || []
    } catch (error) {
      console.error("Error fetching audit logs:", error)
      return []
    }
  },

  async getRecentUserActivity(clinicId: string, userId: string, limit = 10): Promise<AuditLog[]> {
    return this.queryAuditLogs({
      clinicId,
      userId,
      limit,
    })
  },

  async getResourceHistory(clinicId: string, resource: AuditResource, resourceId: string): Promise<AuditLog[]> {
    return this.queryAuditLogs({
      clinicId,
      resource,
      resourceId,
    })
  },
}
