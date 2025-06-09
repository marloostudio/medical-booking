import { type NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

// Define public routes that don't require authentication
const publicRoutes = [
  "/",
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/about",
  "/contact",
  "/terms",
  "/privacy",
  "/features",
  "/pricing",
]

// Define routes that require specific roles
const roleRestrictedRoutes = [
  {
    path: "/admin",
    roles: ["SUPER_ADMIN"],
  },
  {
    path: "/dashboard",
    roles: ["SUPER_ADMIN", "CLINIC_OWNER", "ADMIN", "MEDICAL_STAFF", "RECEPTIONIST"],
  },
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the route is public
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Get the user's session token
  const token = await getToken({ req: request })

  // If no token exists, redirect to login
  if (!token) {
    const url = new URL("/login", request.url)
    url.searchParams.set("callbackUrl", encodeURI(request.url))
    return NextResponse.redirect(url)
  }

  // Check role-restricted routes
  for (const route of roleRestrictedRoutes) {
    if (pathname.startsWith(route.path)) {
      // @ts-ignore - role might not be in the token type
      const userRole = token.role as string

      if (!route.roles.includes(userRole)) {
        // If user doesn't have the required role, redirect to dashboard or home
        const redirectUrl = userRole ? "/dashboard" : "/"
        return NextResponse.redirect(new URL(redirectUrl, request.url))
      }
    }
  }

  // Allow the request to proceed
  return NextResponse.next()
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes (handled separately with their own auth)
     */
    "/((?!_next/static|_next/image|favicon.ico|public|api).*)",
  ],
}
