import { NextResponse } from "next/server"
import { checkEnvironmentVariables } from "@/lib/env-checker"

export async function GET() {
  try {
    // Check environment variables
    const envCheck = checkEnvironmentVariables()

    // Check if Firebase is configured
    const firebaseConfigured = process.env.NEXT_PUBLIC_FIREBASE_API_KEY && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID

    // Check if authentication is configured
    const authConfigured = process.env.NEXTAUTH_SECRET && process.env.NEXTAUTH_URL

    // Check if external services are configured
    const externalServicesConfigured =
      process.env.TWILIO_ACCOUNT_SID && process.env.SENDGRID_API_KEY && process.env.STRIPE_SECRET_KEY

    return NextResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      vercel: {
        environment: process.env.VERCEL_ENV || "unknown",
        region: process.env.VERCEL_REGION || "unknown",
        url: process.env.VERCEL_URL || "unknown",
      },
      checks: {
        firebase: firebaseConfigured ? "configured" : "not configured",
        auth: authConfigured ? "configured" : "not configured",
        externalServices: externalServicesConfigured ? "configured" : "not configured",
        envVars: envCheck.allPresent ? "all present" : "missing some variables",
      },
      version: process.env.npm_package_version || "0.1.0",
    })
  } catch (error) {
    console.error("Health check failed:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "Health check failed",
        error: String(error),
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
