import "server-only"
import { auditService } from "@/services/audit-service"
import type { NextRequest } from "next/server"

/**
 * Server-only utilities for handling common operations
 * This file should never be imported on the client side
 */

export interface ServerSession {
  user: {
    id: string
    email: string
    role: string
    clinicId?: string
  }
}

export const serverUtils = {
  /**
   * Validate clinic access for a user
   */
  validateClinicAccess(session: ServerSession, clinicId: string): boolean {
    const userRole = session.user?.role
    const userClinicId = session.user?.clinicId

    // Super admins can access any clinic
    if (userRole === "SUPER_ADMIN") {
      return true
    }

    // Other users can only access their own clinic
    return userClinicId === clinicId
  },

  /**
   * Get client IP from request headers
   */
  getClientIp(request: NextRequest): string {
    const forwarded = request.headers.get("x-forwarded-for")
    return (forwarded && typeof forwarded === "string" ? forwarded.split(/, /)[0] : null) || "0.0.0.0"
  },

  /**
   * Get user agent from request headers
   */
  getUserAgent(request: NextRequest): string {
    return request.headers.get("user-agent") || "Unknown"
  },

  /**
   * Log audit action with request context
   */
  async logAuditAction(
    request: NextRequest,
    session: ServerSession,
    clinicId: string,
    data: {
      action: string
      resource: string
      resourceId?: string
      details?: string
      success?: boolean
      metadata?: Record<string, any>
    },
  ): Promise<void> {
    await auditService.logAction(clinicId, {
      userId: session.user.id,
      action: data.action as any,
      resource: data.resource as any,
      resourceId: data.resourceId,
      details: data.details,
      ipAddress: this.getClientIp(request),
      userAgent: this.getUserAgent(request),
      success: data.success !== undefined ? data.success : true,
      metadata: data.metadata,
    })
  },

  /**
   * Validate required fields in request body
   */
  validateRequiredFields(data: Record<string, any>, requiredFields: string[]): string | null {
    for (const field of requiredFields) {
      if (!data[field]) {
        return `Missing required field: ${field}`
      }
    }
    return null
  },

  /**
   * Sanitize user input to prevent XSS
   */
  sanitizeInput(input: string): string {
    return input
      .replace(/[<>]/g, "") // Remove potential HTML tags
      .trim()
      .substring(0, 1000) // Limit length
  },

  /**
   * Check if user has permission for specific action
   */
  hasPermission(userRole: string, action: string, resource: string): boolean {
    // Define role-based permissions
    const permissions = {
      SUPER_ADMIN: ["*"], // All permissions
      CLINIC_OWNER: ["create", "read", "update", "delete"],
      ADMIN: ["create", "read", "update"],
      RECEPTIONIST: ["create", "read", "update"],
      MEDICAL_STAFF: ["read", "update"],
    }

    const userPermissions = permissions[userRole as keyof typeof permissions] || []
    return userPermissions.includes("*") || userPermissions.includes(action)
  },
}
