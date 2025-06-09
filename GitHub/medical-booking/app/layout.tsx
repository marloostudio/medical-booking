import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { NextAuthProvider } from "@/components/providers/session-provider"
// Import the function correctly - try both ways
import validateCriticalEnvVars from "@/lib/env-checker"
// Alternatively, if the above doesn't work:
// import { validateCriticalEnvVars } from "@/lib/env-checker"

// Validate critical environment variables
try {
  validateCriticalEnvVars()
} catch (error) {
  console.error("Environment validation error:", error)
  // Continue execution - we'll handle missing vars in the components that need them
}

export const metadata: Metadata = {
  title: "BookingLink - Medical Appointment Booking Platform",
  description: "Streamline your clinic's appointment scheduling with BookingLink",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans bg-white">
        <NextAuthProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </NextAuthProvider>
      </body>
    </html>
  )
}
