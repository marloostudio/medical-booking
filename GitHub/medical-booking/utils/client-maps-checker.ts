"use client"

/**
 * Client-side utility to check if Google Maps is configured
 * This safely checks without exposing API keys
 */

export const checkMapsAvailability = async () => {
  try {
    const response = await fetch("/api/maps/config")

    if (!response.ok) {
      throw new Error("Failed to check Maps configuration")
    }

    const data = await response.json()
    return data.configured
  } catch (error) {
    console.error("Error checking Maps availability:", error)
    return false
  }
}

export const useMapsAvailability = () => {
  // This is a placeholder for a React hook that would check Maps availability
  // You could implement this with React Query or SWR
  return { isLoading: false, isAvailable: true }
}
