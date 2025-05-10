"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { isFirebaseInitialized } from "@/lib/firebase"

type SystemCheckResult = {
  name: string
  status: "success" | "error" | "warning"
  message: string
}

// Remove useSearchParams and accept tab as a prop
export function SystemCheckClient({ initialTab = "all" }: { initialTab?: string }) {
  const [results, setResults] = useState<SystemCheckResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const [activeTab, setActiveTab] = useState(initialTab)

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    router.push(`${pathname}?tab=${tab}`)
  }

  const runSystemCheck = async () => {
    setIsLoading(true)
    setResults([])

    try {
      // Check Firebase Client
      const firebaseInitialized = isFirebaseInitialized()
      setResults((prev) => [
        ...prev,
        {
          name: "Firebase Client",
          status: firebaseInitialized ? "success" : "error",
          message: firebaseInitialized
            ? "Firebase client initialized successfully"
            : "Firebase client not initialized. Check your environment variables.",
        },
      ])

      // Check API Health
      try {
        const healthResponse = await fetch("/api/health")
        const healthData = await healthResponse.json()

        setResults((prev) => [
          ...prev,
          {
            name: "API Health",
            status: healthData.status === "ok" ? "success" : "error",
            message:
              healthData.status === "ok"
                ? "API is healthy"
                : `API health check failed: ${healthData.message || "Unknown error"}`,
          },
        ])

        // Add detailed checks from health endpoint
        if (healthData.checks) {
          Object.entries(healthData.checks).forEach(([name, status]) => {
            setResults((prev) => [
              ...prev,
              {
                name: `${name.charAt(0).toUpperCase() + name.slice(1)} Configuration`,
                status: status === "configured" ? "success" : "warning",
                message: status === "configured" ? `${name} is properly configured` : `${name} is not configured`,
              },
            ])
          })
        }
      } catch (error) {
        setResults((prev) => [
          ...prev,
          {
            name: "API Health",
            status: "error",
            message: `Error checking API health: ${error instanceof Error ? error.message : String(error)}`,
          },
        ])
      }

      // Check environment variables
      try {
        const envResponse = await fetch("/api/env-check")
        const envData = await envResponse.json()

        setResults((prev) => [
          ...prev,
          {
            name: "Environment Variables",
            status: envData.allPresent ? "success" : "warning",
            message: envData.allPresent
              ? "All required environment variables are set"
              : "Some environment variables are missing",
          },
        ])

        // Add detailed env var checks
        if (envData.missingVars) {
          Object.entries(envData.missingVars).forEach(([category, vars]) => {
            setResults((prev) => [
              ...prev,
              {
                name: `${category} Variables`,
                status: "warning",
                message: `Missing: ${(vars as string[]).join(", ")}`,
              },
            ])
          })
        }
      } catch (error) {
        setResults((prev) => [
          ...prev,
          {
            name: "Environment Variables",
            status: "error",
            message: `Error checking environment variables: ${error instanceof Error ? error.message : String(error)}`,
          },
        ])
      }
    } catch (error) {
      setResults((prev) => [
        ...prev,
        {
          name: "System Check",
          status: "error",
          message: `Error running system check: ${error instanceof Error ? error.message : String(error)}`,
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    runSystemCheck()
  }, [])

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>System Health Check</CardTitle>
          <CardDescription>Check the health and configuration of your Medical Booking Platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {results.length === 0 && isLoading && (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-sm text-muted-foreground">Running system checks...</p>
              </div>
            )}

            {results.map((result, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {result.status === "success" && <CheckCircle className="h-5 w-5 text-green-500" />}
                    {result.status === "error" && <XCircle className="h-5 w-5 text-red-500" />}
                    {result.status === "warning" && <AlertCircle className="h-5 w-5 text-yellow-500" />}
                    <h3 className="font-medium">{result.name}</h3>
                  </div>
                  <Badge
                    variant={
                      result.status === "success" ? "default" : result.status === "error" ? "destructive" : "outline"
                    }
                  >
                    {result.status}
                  </Badge>
                </div>
                <Separator className="my-2" />
                <p className="text-sm text-muted-foreground">{result.message}</p>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={runSystemCheck} disabled={isLoading} className="w-full">
            {isLoading ? "Running Checks..." : "Run System Check Again"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

function EnvironmentCheck() {
  return <div>Environment variables check...</div>
}

function DatabaseCheck() {
  return <div>Database connection check...</div>
}

function ServicesCheck() {
  return <div>External services check...</div>
}
