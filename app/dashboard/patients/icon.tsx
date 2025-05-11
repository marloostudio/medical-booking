import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(request: NextRequest) {
  try {
    return new ImageResponse(
      <div
        style={{
          fontSize: 40,
          background: "white",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#0070f3",
          borderRadius: "50%",
          padding: 20,
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      </div>,
      {
        width: 48,
        height: 48,
      },
    )
  } catch (error) {
    console.error("Error generating patients icon:", error)
    return new Response("Error generating icon", { status: 500 })
  }
}

export function generateImageMetadata() {
  return [
    {
      contentType: "image/svg+xml",
      size: { width: 48, height: 48 },
      id: "patients-icon",
    },
  ]
}
