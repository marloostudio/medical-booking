"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function TestMapsApiPage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState("123 Main")

  const testApi = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/maps?query=${encodeURIComponent(query)}`)
      const data = await response.json()

      if (!response.ok) {
        setError(`Error ${response.status}: ${data.error || "Unknown error"}`)
        setResult(data)
        return
      }

      setResult(data)
    } catch (err) {
      setError(`Failed to fetch: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Google Maps API Test</CardTitle>
          <CardDescription>Test your Google Maps API configuration to ensure it's working correctly.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="query">Test Query</Label>
              <Input
                id="query"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter an address to search"
              />
            </div>

            <Button onClick={testApi} disabled={loading}>
              {loading ? "Testing..." : "Test API"}
            </Button>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <h3 className="font-medium text-red-800">Error</h3>
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {result && (
              <div className="mt-4">
                <h3 className="font-medium mb-2">API Response:</h3>
                <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-96 text-sm">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-gray-500">
            Make sure your GOOGLE_MAPS_API_KEY environment variable is set correctly.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
