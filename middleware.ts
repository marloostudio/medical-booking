import { type NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import { superAdminMiddleware } from "./middleware/super-admin-middleware"

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

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname

  // Apply super admin middleware for admin routes
  if (path.startsWith("/admin")) {
    return superAdminMiddleware(req)
  }

  // Handle other protected routes (dashboard, etc.)
  if (path.startsWith("/dashboard")) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

    // For development/testing purposes, allow access even without a token
    // In production, you would remove this condition and keep only the redirect
    if (!token && process.env.NODE_ENV === "production") {
      return NextResponse.redirect(new URL("/login?error=unauthorized", req.url))
    }
  }

  // Create a response object from the request
  const response = NextResponse.next()

  // Add cache control headers to prevent caching
  response.headers.set("Cache-Control", "no-store, max-age=0, must-revalidate")
  response.headers.set("Pragma", "no-cache")
  response.headers.set("Expires", "0")

  // Redirect patients dashboard to main dashboard
  if (req.nextUrl.pathname === "/dashboard/patients" || req.nextUrl.pathname.startsWith("/dashboard/patients/")) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  return response
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
}
