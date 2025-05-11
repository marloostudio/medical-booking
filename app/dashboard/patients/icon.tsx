import { NextResponse } from "next/server"

// Route handler for API requests to this path
export async function GET() {
  return NextResponse.json({
    message: "Icon data endpoint",
  })
}

// Default export for the React component (used for rendering)
export default function PatientsIcon() {
  // This is the React component that will be rendered in the UI
  return null
}

// Generate an icon image if needed
export function generateImageMetadata() {
  return [
    {
      contentType: "image/svg+xml",
      size: { width: 48, height: 48 },
      id: "patients-icon",
    },
  ]
}
