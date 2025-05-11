import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { NextAuthProvider } from "@/components/providers/session-provider"

const inter = Inter({ subsets: ["latin"] })

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
      <body className={`${inter.className} bg-white`}>
        <NextAuthProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </NextAuthProvider>
      </body>
    </html>
  )
}
