"use client"

import { useRouter, usePathname } from "next/navigation"

/**
 * Hook for client-side navigation with URL parameters
 * Use this instead of useSearchParams()
 */
export function useUrlNavigation() {
  const router = useRouter()
  const pathname = usePathname()

  /**
   * Navigate to a new URL with the given parameters
   * @param params Object containing query parameters
   */
  const navigateWithParams = (params: Record<string, string | number | boolean | undefined>) => {
    const url = new URL(pathname, window.location.origin)

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.set(key, String(value))
      }
    })

    router.push(url.toString())
  }

  /**
   * Get a parameter from the current URL
   * @param key The parameter key to get
   * @param defaultValue The default value if the parameter is not present
   */
  const getUrlParam = <T extends string | number | boolean>(key: string, defaultValue: T): T => {
    if (typeof window === "undefined") return defaultValue

    const params = new URLSearchParams(window.location.search)
    const value = params.get(key)

    if (value === null) return defaultValue

    // Handle different types
    if (typeof defaultValue === "number") {
      return Number(value) as unknown as T
    }

    if (typeof defaultValue === "boolean") {
      return (value === "true") as unknown as T
    }

    return value as unknown as T
  }

  return { navigateWithParams, getUrlParam }
}
