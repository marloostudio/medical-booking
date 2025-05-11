import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const address = searchParams.get("address")

  if (!address) {
    return NextResponse.json({ error: "address parameter is required" }, { status: 400 })
  }

  // Use the server-side environment variable
  const apiKey = process.env.GOOGLE_MAPS_API_KEY
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`

  try {
    const response = await fetch(url)
    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error geocoding address:", error)
    return NextResponse.json({ error: "Failed to geocode address" }, { status: 500 })
  }
}
