import "server-only"

import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"

import { hasPermission, type PermissionAction, type ResourceType } from "./permissions"
import type { UserRole } from "./role-permissions"

export interface AuthContext {
  session: any
  user: {
    id: string
    email: string
    role: UserRole
    clinicId?: string
  }
}

export interface AuthMiddlewareOptions {
  requireAuth?: boolean
  requiredRoles?: UserRole[]
  requiredPermission?: {
    action: PermissionAction
    resource: ResourceType
    scope?: "own" | "clinic" | "all"
  }
  allowSuperAdmin?: boolean
}

/**
 * Centralized authentication middleware for API routes
 */
export async function withAuth(
  request: NextRequest,
  options: AuthMiddlewareOptions = {},
): Promise<{ success: true; context: AuthContext } | { success: false; response: NextResponse }> {
  const { requireAuth = true, requiredRoles = [], requiredPermission, allowSuperAdmin = true } = options

  // Skip auth check if not required
  if (!requireAuth) {
    return {
      success: true,
      context: {
        session: null,
        user: null as any,
      },
    }
  }

  // Get session
  const session = await getServerSession()

  if (!session?.user) {
    return {
      success: false,
      response: NextResponse.json({ error: "Authentication required", code: "AUTH_REQUIRED" }, { status: 401 }),
    }
  }

  const user = {
    id: session.user.id,
    email: session.user.email!,
    role: session.user.role as UserRole,
    clinicId: session.user.clinicId as string | undefined,
  }

  // Check if user is super admin (bypass most checks)
  if (allowSuperAdmin && user.role === "SUPER_ADMIN") {
    return {
      success: true,
      context: { session, user },
    }
  }

  // Check required roles
  if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
    return {
      success: false,
      response: NextResponse.json(
        {
          error: "Insufficient permissions",
          code: "INSUFFICIENT_ROLE",
          required: requiredRoles,
          current: user.role,
        },
        { status: 403 },
      ),
    }
  }

  // Check specific permissions
  if (requiredPermission) {
    const { action, resource, scope = "own" } = requiredPermission

    if (!hasPermission(user.role, action, resource, scope)) {
      return {
        success: false,
        response: NextResponse.json(
          {
            error: "Permission denied",
            code: "PERMISSION_DENIED",
            required: requiredPermission,
          },
          { status: 403 },
        ),
      }
    }
  }

  return {
    success: true,
    context: { session, user },
  }
}

/**
 * Higher-order function to wrap API route handlers with auth
 */
export function withAuthHandler(
  handler: (request: NextRequest, context: AuthContext, params?: any) => Promise<NextResponse>,
  options: AuthMiddlewareOptions = {},
) {
  return async (request: NextRequest, routeParams?: { params: any }) => {
    const authResult = await withAuth(request, options)

    if (!authResult.success) {
      return authResult.response
    }

    try {
      return await handler(request, authResult.context, routeParams?.params)
    } catch (error) {
      console.error("API route error:", error)
      return NextResponse.json({ error: "Internal server error", code: "INTERNAL_ERROR" }, { status: 500 })
    }
  }
}

/**
 * Clinic-specific auth middleware
 */
export async function withClinicAuth(
  request: NextRequest,
  clinicId: string,
  options: Omit<AuthMiddlewareOptions, "requiredPermission"> & {
    requiredPermission?: Omit<AuthMiddlewareOptions["requiredPermission"], "scope">
  } = {},
): Promise<{ success: true; context: AuthContext } | { success: false; response: NextResponse }> {
  const authResult = await withAuth(request, {
    ...options,
    requiredPermission: options.requiredPermission ? { ...options.requiredPermission, scope: "clinic" } : undefined,
  })

  if (!authResult.success) {
    return authResult
  }

  const { user } = authResult.context

  // Super admin can access any clinic
  if (user.role === "SUPER_ADMIN") {
    return authResult
  }

  // Check clinic membership
  if (!user.clinicId || user.clinicId !== clinicId) {
    return {
      success: false,
      response: NextResponse.json(
        {
          error: "Access denied to this clinic",
          code: "CLINIC_ACCESS_DENIED",
          userClinic: user.clinicId,
          requestedClinic: clinicId,
        },
        { status: 403 },
      ),
    }
  }

  return authResult
}

/**
 * Utility to extract clinic ID from request
 */
export function getClinicIdFromRequest(request: NextRequest, params?: any): string | null {
  // Try to get from URL params first
  if (params?.clinicId) {
    return params.clinicId
  }

  // Try to get from query parameters
  const { searchParams } = new URL(request.url)
  const clinicIdFromQuery = searchParams.get("clinicId")
  if (clinicIdFromQuery) {
    return clinicIdFromQuery
  }

  // Try to get from request body (for POST/PUT requests)
  // Note: This would require parsing the body, which should be done carefully
  // to avoid consuming the stream multiple times

  return null
}

/**
 * Rate limiting middleware (basic implementation)
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export function withRateLimit(
  identifier: string,
  limit = 100,
  windowMs: number = 15 * 60 * 1000, // 15 minutes
): { success: true } | { success: false; response: NextResponse } {
  const now = Date.now()
  const windowStart = now - windowMs

  // Clean up old entries
  for (const [key, value] of rateLimitMap.entries()) {
    if (value.resetTime < windowStart) {
      rateLimitMap.delete(key)
    }
  }

  const current = rateLimitMap.get(identifier)

  if (!current) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs })
    return { success: true }
  }

  if (current.resetTime < now) {
    // Reset the window
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs })
    return { success: true }
  }

  if (current.count >= limit) {
    return {
      success: false,
      response: NextResponse.json(
        {
          error: "Rate limit exceeded",
          code: "RATE_LIMIT_EXCEEDED",
          limit,
          windowMs,
          retryAfter: Math.ceil((current.resetTime - now) / 1000),
        },
        {
          status: 429,
          headers: {
            "Retry-After": Math.ceil((current.resetTime - now) / 1000).toString(),
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": Math.max(0, limit - current.count).toString(),
            "X-RateLimit-Reset": new Date(current.resetTime).toISOString(),
          },
        },
      ),
    }
  }

  current.count++
  return { success: true }
}
