import { NextResponse } from "next/server"

export async function GET() {
  // Create a public-safe version of environment variables status
  // Only return boolean values indicating if they're configured, not the actual values
  const envStatus = {
    ENCRYPTION_KEY_CONFIGURED: Boolean(process.env.ENCRYPTION_KEY),
    GOOGLE_CLIENT_ID_CONFIGURED: Boolean(process.env.GOOGLE_CLIENT_ID),
    GOOGLE_CLIENT_SECRET_CONFIGURED: Boolean(process.env.GOOGLE_CLIENT_SECRET),
    // Add any other environment variables you want to check
  }

  return NextResponse.json(envStatus)
}
