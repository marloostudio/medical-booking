import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "BookingLink Patient Management"
export const contentType = "image/png"
export const size = {
  width: 1200,
  height: 630,
}

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        fontSize: 60,
        color: "white",
        background: "linear-gradient(to bottom, #3b82f6, #1e40af)",
        width: "100%",
        height: "100%",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 50,
      }}
    >
      <div style={{ fontSize: 80, fontWeight: "bold", marginBottom: 20 }}>BookingLink</div>
      <div style={{ fontSize: 40, opacity: 0.8 }}>Patient Management System</div>
    </div>,
    {
      ...size,
    },
  )
}
