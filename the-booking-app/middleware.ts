import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Public paths that don't require authentication
const publicPaths = [
  "/",
  "/login",
  "/signup",
  "/about",
  "/contact",
  "/pricing",
  "/api/auth",
  "/sitemap.xml",
  "/robots.txt",
  "/favicon.ico",
  "/demo",
]

// Check if a path should be public
const isPublicPath = (path: string) => {
  return publicPaths.some(
    (publicPath) =>
      path === publicPath ||
      path.startsWith("/api/auth/") ||
      path.startsWith("/_next/") ||
      path.startsWith("/booking/") ||
      path.startsWith("/admin/") || // Add this line to allow admin routes
      path.startsWith("/admin-dashboard/") || // Add this line for our alternative route
      path.startsWith("/test-deployment/"), // Add this line for our test page
  )
}

export async function middleware(request: NextRequest) {
  // Redirect patients dashboard to main dashboard
  if (
    request.nextUrl.pathname === "/dashboard/patients" ||
    request.nextUrl.pathname.startsWith("/dashboard/patients/")
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  const { pathname } = request.nextUrl

  // Clone the response
  const response = NextResponse.next()

  // Add cache control headers to disable caching
  response.headers.set("Cache-Control", "no-store, max-age=0, must-revalidate")
  response.headers.set("Pragma", "no-cache")
  response.headers.set("Expires", "0")

  // Set security headers
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-XSS-Protection", "1; mode=block")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline'; connect-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; font-src 'self' data:; frame-src 'self'",
  )

  // For this example, we're not implementing actual authentication
  // In a real app, you would check for a valid session/token here

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
    "/dashboard/:path*",
  ],
}
