import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  // Get the API key from server-side environment variable (not exposed to client)
  const apiKey = process.env.GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    return NextResponse.json({ error: "Google Maps API key is missing on the server" }, { status: 500 })
  }

  // Get the address from the request
  const searchParams = request.nextUrl.searchParams
  const address = searchParams.get("address")

  if (!address) {
    return NextResponse.json({ error: "address parameter is required" }, { status: 400 })
  }

  try {
    // Make the request to Google Geocoding API from the server
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`,
    )

    if (!response.ok) {
      console.error("Google API error:", await response.text())
      return NextResponse.json({ error: "Failed to geocode address" }, { status: response.status })
    }

    const data = await response.json()

    // Return only the necessary data to the client (not the API key)
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error geocoding address:", error)
    return NextResponse.json({ error: "Failed to geocode address" }, { status: 500 })
  }
}
