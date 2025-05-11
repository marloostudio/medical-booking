import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("query")

  if (!query) {
    return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
  }

  // Use the server-side environment variable instead of NEXT_PUBLIC_
  const apiKey = process.env.GOOGLE_MAPS_API_KEY
  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&key=${apiKey}`

  try {
    const response = await fetch(url)
    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching from Google Maps API:", error)
    return NextResponse.json({ error: "Failed to fetch from Google Maps API" }, { status: 500 })
  }
}
