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
  // Create a response object from the request
  const response = NextResponse.next()

  // Add cache control headers to prevent caching
  response.headers.set("Cache-Control", "no-store, max-age=0, must-revalidate")
  response.headers.set("Pragma", "no-cache")
  response.headers.set("Expires", "0")

  // Redirect patients dashboard to main dashboard
  if (
    request.nextUrl.pathname === "/dashboard/patients" ||
    request.nextUrl.pathname.startsWith("/dashboard/patients/")
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
}
