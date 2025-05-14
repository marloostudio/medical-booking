"use client"

import { useEffect, useState } from "react"
import Script from "next/script"

export function GoogleMapsScript() {
  const [scriptUrl, setScriptUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Fetch the script URL from our server API route
    const fetchScriptUrl = async () => {
      try {
        const response = await fetch("/api/maps/script-url")
        if (!response.ok) {
          throw new Error("Failed to fetch Google Maps script URL")
        }
        const data = await response.json()
        setScriptUrl(data.url)
      } catch (error) {
        console.error("Error fetching Google Maps script URL:", error)
        setError("Failed to load Google Maps. Please try again later.")
      }
    }

    fetchScriptUrl()
  }, [])

  if (error) {
    return <div className="text-red-500 text-sm">{error}</div>
  }

  if (!scriptUrl) {
    return null
  }

  return (
    <Script
      src={scriptUrl}
      strategy="lazyOnload"
      onLoad={() => {
        console.log("Google Maps script loaded successfully")
      }}
      onError={() => {
        console.error("Error loading Google Maps script")
      }}
    />
  )
}
