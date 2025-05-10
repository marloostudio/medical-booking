import { withAuthHandler, withClinicAuth } from "@/lib/auth-middleware"

// Example: Clinic-specific route using the new middleware
export const GET = withAuthHandler(
  async (request, context, params) => {
    const { clinicId } = params

    // Additional clinic auth check
    const clinicAuthResult = await withClinicAuth(request, clinicId, {
      requiredPermission: {
        action: "read",
        resource: "appointments",
      },
    })

    if (!clinicAuthResult.success) {
      return clinicAuthResult.response
    }

    return Response.json({
      message: `Access granted to clinic ${clinicId}`,
      user: context.user.email,
    })
  },
  {
    requireAuth: true,
  },
)
