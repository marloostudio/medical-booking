import { db } from "@/lib/firebase"
import { doc, setDoc, collection, where, orderBy, getDocs } from "firebase/firestore"
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
      const logRef = doc(db, `clinics/${clinicId}/logs/${id}`)
      await setDoc(logRef, auditLog)

      // Also store in global audit logs for super admin access
      const globalLogRef = doc(db, `auditLogs/${id}`)
      await setDoc(globalLogRef, {
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
      const auditQuery = collection(db, `clinics/${clinicId}/logs`)
      const constraints = []

      // Add query constraints
      if (userId) {
        constraints.push(where("userId", "==", userId))
      }

      if (action) {
        constraints.push(where("action", "==", action))
      }

      if (resource) {
        constraints.push(where("resource", "==", resource))
      }

      if (resourceId) {
        constraints.push(where("resourceId", "==", resourceId))
      }

      if (startDate) {
        constraints.push(where("timestamp", ">=", startDate.getTime()))
      }

      if (endDate) {
        constraints.push(where("timestamp", "<=", endDate.getTime()))
      }

      // Add ordering
      constraints.push(orderBy("timestamp", "desc"))

      // Execute query
      const snapshot = await getDocs(query(auditQuery, ...constraints))

      // Process results
      const logs: AuditLog[] = []
      snapshot.forEach((doc) => {
        logs.push(doc.data() as AuditLog)
      })

      // Apply limit if specified
      if (limit && logs.length > limit) {
        return logs.slice(0, limit)
      }

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
