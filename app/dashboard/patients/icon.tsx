import { NextResponse } from "next/server"

// Only one GET function export
export async function GET() {
  // Create a simple SVG icon for patients
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>`

  // Return the SVG as a response with the correct content type
  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  })
}

// This is needed for Next.js metadata routes
export const generateImageMetadata = () => {
  return [
    {
      contentType: "image/svg+xml",
      size: { width: 48, height: 48 },
      id: "patients-icon",
    },
  ]
}
