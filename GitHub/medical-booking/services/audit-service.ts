import "server-only"
import { adminDb } from "@/lib/firebase-admin-server"
import { v4 as uuidv4 } from "uuid"

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

export const auditService = {
  async logAction(
    clinicId: string,
    data: Omit<AuditLog, "id" | "timestamp" | "success"> & { success?: boolean },
  ): Promise<void> {
    const id = uuidv4()
    const timestamp = Date.now()

    const auditLog: AuditLog = {
      ...data,
      id,
      timestamp,
      success: data.success !== undefined ? data.success : true,
    }

    try {
      // Store in clinic-specific audit logs
      const logRef = adminDb.collection(`clinics/${clinicId}/logs`).doc(id)
      await logRef.set(auditLog)

      // Also store in global audit logs for super admin access
      const globalLogRef = adminDb.collection(`auditLogs`).doc(id)
      await globalLogRef.set({
        ...auditLog,
        clinicId,
      })
    } catch (error) {
      console.error("Failed to write audit log:", error)
      // We don't want to throw here as it could disrupt the main operation
      // Instead, we'll log to console and continue
    }
  },

  async queryAuditLogs(query: AuditQuery): Promise<AuditLog[]> {
    try {
      const { clinicId, userId, action, resource, resourceId, startDate, endDate, limit } = query

      // Start building the query
      let auditQuery = adminDb.collection(`clinics/${clinicId}/logs`)

      // Add query constraints
      if (userId) {
        auditQuery = auditQuery.where("userId", "==", userId)
      }

      if (action) {
        auditQuery = auditQuery.where("action", "==", action)
      }

      if (resource) {
        auditQuery = auditQuery.where("resource", "==", resource)
      }

      if (resourceId) {
        auditQuery = auditQuery.where("resourceId", "==", resourceId)
      }

      if (startDate) {
        auditQuery = auditQuery.where("timestamp", ">=", startDate.getTime())
      }

      if (endDate) {
        auditQuery = auditQuery.where("timestamp", "<=", endDate.getTime())
      }

      // Add ordering
      auditQuery = auditQuery.orderBy("timestamp", "desc")

      // Apply limit if specified
      if (limit) {
        auditQuery = auditQuery.limit(limit)
      }

      // Execute query
      const snapshot = await auditQuery.get()

      // Process results
      const logs: AuditLog[] = []
      snapshot.forEach((doc) => {
        logs.push(doc.data() as AuditLog)
      })

      return logs
    } catch (error) {
      console.error("Error querying audit logs:", error)
      throw new Error(`Failed to query audit logs: ${error.message}`)
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

  // Helper method to get client IP from request
  getClientIp(req: Request): string {
    const forwarded = req.headers.get("x-forwarded-for")
    return (forwarded && typeof forwarded === "string" ? forwarded.split(/, /)[0] : null) || "0.0.0.0"
  },

  // Helper method to get user agent from request
  getUserAgent(req: Request): string {
    return req.headers.get("user-agent") || "Unknown"
  },
}
