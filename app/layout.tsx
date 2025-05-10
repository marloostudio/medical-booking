import type React from "react"
import "./globals.css"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Medical Booking Platform",
  description: "Schedule appointments, manage patients, and streamline your clinic operations.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Dashboard and admin pages have their own layouts
  const isDashboardOrAdmin = (path: string) => {
    return path.startsWith("/dashboard") || path.startsWith("/admin")
  }

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
