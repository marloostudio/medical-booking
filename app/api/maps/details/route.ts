import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const placeId = searchParams.get("placeId")

  if (!placeId) {
    return NextResponse.json({ error: "placeId parameter is required" }, { status: 400 })
  }

  // Use the server-side environment variable instead of NEXT_PUBLIC_
  const apiKey = process.env.GOOGLE_MAPS_API_KEY
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=address_component&key=${apiKey}`

  try {
    const response = await fetch(url)
    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching place details from Google Maps API:", error)
    return NextResponse.json({ error: "Failed to fetch place details" }, { status: 500 })
  }
}
