import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    return new Response("Google Maps API key is missing", { status: 500 })
  }

  // Get the callback name from the request
  const searchParams = request.nextUrl.searchParams
  const callback = searchParams.get("callback") || "initMap"

  // Fetch the Google Maps script
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=${callback}`,
  )

  if (!response.ok) {
    return new Response("Failed to load Google Maps script", { status: response.status })
  }

  // Get the script content
  const scriptContent = await response.text()

  // Return the script with the correct content type
  return new Response(scriptContent, {
    headers: {
      "Content-Type": "application/javascript",
    },
  })
}
