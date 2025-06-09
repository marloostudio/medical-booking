"use client"

/**
 * Utility functions for handling URL parameters
 * Use these instead of useSearchParams() to avoid client-side bailout issues
 */

/**
 * Get a parameter from searchParams with type safety
 * @param searchParams The searchParams object from the page props
 * @param key The parameter key to get
 * @param defaultValue The default value if the parameter is not present
 */
export function getParam<T>(
  searchParams: Record<string, string | string[] | undefined>,
  key: string,
  defaultValue: T,
): T {
  const value = searchParams[key]
  if (value === undefined) return defaultValue

  // Handle different types
  if (typeof defaultValue === "number") {
    return Number(value) as unknown as T
  }

  if (typeof defaultValue === "boolean") {
    return (value === "true") as unknown as T
  }

  return value as unknown as T
}

/**
 * Build a URL with the given parameters
 * @param pathname The base pathname
 * @param params The parameters to add to the URL
 */
export function buildUrl(pathname: string, params: Record<string, string | number | boolean | undefined>): string {
  const url = new URL(pathname, "http://localhost")

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.set(key, String(value))
    }
  })

  return `${url.pathname}${url.search}`
}
