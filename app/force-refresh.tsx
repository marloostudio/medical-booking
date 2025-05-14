"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function ForceRefresh() {
  const router = useRouter()

  useEffect(() => {
    // Clear browser cache for this page
    if (typeof window !== "undefined") {
      // Add a timestamp to force a refresh
      const timestamp = new Date().getTime()
      router.replace(`${window.location.pathname}?t=${timestamp}`)
    }
  }, [router])

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Refreshing Page</h2>
        <p className="text-gray-600">Please wait while we refresh your page...</p>
        <div className="mt-4 w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  )
}
