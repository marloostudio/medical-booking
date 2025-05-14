import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("query")

  if (!query) {
    return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
  }

  try {
    // Use server-side API key for security
    const apiKey = process.env.GOOGLE_MAPS_API_KEY

    if (!apiKey) {
      console.error("Google Maps API key is missing")
      return NextResponse.json({ error: "Configuration error" }, { status: 500 })
    }

    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
      query,
    )}&types=address&key=${apiKey}`

    const response = await fetch(url)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Google Maps API HTTP error:", response.status, errorText)
      return NextResponse.json(
        { error: `Google Maps API HTTP error: ${response.status}`, details: errorText },
        { status: response.status },
      )
    }

    const data = await response.json()

    if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
      console.error("Google Maps API error:", data.status, data.error_message)
      return NextResponse.json(
        { error: `Google Maps API error: ${data.status}`, details: data.error_message },
        { status: 500 },
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching address suggestions:", error)
    return NextResponse.json({ error: "Failed to fetch address suggestions", details: String(error) }, { status: 500 })
  }
}
