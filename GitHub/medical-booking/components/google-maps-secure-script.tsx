"use client"

import { useEffect, useState } from "react"

interface GoogleMapsScriptProps {
  onLoad?: () => void
  onError?: (error: Error) => void
}

export function GoogleMapsSecureScript({ onLoad, onError }: GoogleMapsScriptProps) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    // Define a global callback function
    const callbackName = `initGoogleMaps${Date.now()}`

    // @ts-ignore
    window[callbackName] = () => {
      setLoaded(true)
      if (onLoad) onLoad()
      // Clean up the global function
      // @ts-ignore
      delete window[callbackName]
    }

    // Create script element
    const script = document.createElement("script")
    script.src = `/api/maps/load-script?callback=${callbackName}`
    script.async = true
    script.defer = true

    // Handle errors
    script.onerror = (e) => {
      const err = new Error("Failed to load Google Maps script")
      setError(err)
      if (onError) onError(err)
    }

    // Add script to document
    document.head.appendChild(script)

    // Clean up
    return () => {
      document.head.removeChild(script)
      // @ts-ignore
      if (window[callbackName]) delete window[callbackName]
    }
  }, [onLoad, onError])

  return null
}
