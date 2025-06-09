import { NextResponse } from "next/server"

export const runtime = "nodejs"

export async function GET() {
  try {
    // Check if Google Maps API key is configured
    const apiKeyConfigured = !!process.env.GOOGLE_MAPS_API_KEY

    // Don't expose the actual API key, just whether it's configured
    return NextResponse.json({
      configured: apiKeyConfigured,
      message: apiKeyConfigured ? "Google Maps API is properly configured" : "Google Maps API key is missing",
    })
  } catch (error) {
    console.error("Error checking Google Maps configuration:", error)
    return NextResponse.json({ error: "Failed to check Google Maps configuration" }, { status: 500 })
  }
}
