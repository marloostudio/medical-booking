import { NextResponse } from "next/server"

export async function GET() {
  // Instead of exposing the API key, we'll use the Google Maps loader with a callback
  // This is more secure as it doesn't expose the API key in the client
  return NextResponse.json({
    url: "/api/maps/load-script",
    message: "Use this endpoint to load the Google Maps script securely",
  })
}
