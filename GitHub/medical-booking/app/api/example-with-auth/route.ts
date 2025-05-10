import { withAuthHandler } from "@/lib/auth-middleware"

// Example: Simple authenticated route
export const GET = withAuthHandler(
  async (request, { user }) => {
    return Response.json({
      message: "Hello authenticated user!",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    })
  },
  {
    requireAuth: true,
  },
)

// Example: Role-restricted route
export const POST = withAuthHandler(
  async (request, { user }) => {
    const body = await request.json()

    return Response.json({
      message: "Admin action completed",
      data: body,
      performedBy: user.email,
    })
  },
  {
    requireAuth: true,
    requiredRoles: ["SUPER_ADMIN", "CLINIC_OWNER"],
  },
)

// Example: Permission-based route
export const PUT = withAuthHandler(
  async (request, { user }) => {
    return Response.json({
      message: "User management action",
      user: user.email,
    })
  },
  {
    requireAuth: true,
    requiredPermission: {
      action: "update",
      resource: "users",
      scope: "clinic",
    },
  },
)
