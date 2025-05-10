"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, XCircle, AlertCircle, RefreshCw } from "lucide-react"

interface SystemCheckResult {
  timestamp: string
  environmentVariables: {
    isValid: boolean
    message: string
    details?: Record<string, { isValid: boolean; message: string }>
  }
  encryption: {
    isValid: boolean
    message: string
  }
  googleOAuth: {
    isValid: boolean
    message: string
  }
  overallStatus: "PASSED" | "FAILED"
}

export function SystemCheckClient({ initialTab, debug }: { initialTab: string; debug: boolean }) {
  const [activeTab, setActiveTab] = useState(initialTab)
  const router = useRouter()
  const pathname = usePathname()

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    router.push(`${pathname}?tab=${tab}`)
  }

  return (
    <div>
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => handleTabChange("environment")}
          className={`px-4 py-2 ${activeTab === "environment" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Environment
        </button>
        <button
          onClick={() => handleTabChange("database")}
          className={`px-4 py-2 ${activeTab === "database" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Database
        </button>
        <button
          onClick={() => handleTabChange("services")}
          className={`px-4 py-2 ${activeTab === "services" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Services
        </button>
      </div>

      <div className="mt-4">
        {activeTab === "environment" && <EnvironmentCheck debug={debug} />}
        {activeTab === "database" && <DatabaseCheck />}
        {activeTab === "services" && <ServicesCheck />}
      </div>
    </div>
  )
}

function EnvironmentCheck({ debug }: { debug: boolean }) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SystemCheckResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const runSystemCheck = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/system/test-env")

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to run system check")
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    runSystemCheck()
  }, [])

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <Button onClick={runSystemCheck} disabled={loading} className="flex items-center gap-2">
          {loading ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Running Checks...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4" />
              Run System Check
            </>
          )}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Overall Status</CardTitle>
                  <CardDescription>Last checked: {new Date(result.timestamp).toLocaleString()}</CardDescription>
                </div>
                <div
                  className={`text-lg font-bold ${result.overallStatus === "PASSED" ? "text-green-500" : "text-red-500"}`}
                >
                  {result.overallStatus === "PASSED" ? (
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-6 w-6" />
                      PASSED
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <XCircle className="h-6 w-6" />
                      FAILED
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Environment Variables</CardTitle>
              <CardDescription>Checking if required environment variables are properly configured</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {result.environmentVariables.details &&
                  Object.entries(result.environmentVariables.details).map(([key, value]) => (
                    <div key={key} className="flex items-start justify-between border-b pb-2">
                      <div>
                        <p className="font-medium">{key}</p>
                        <p className="text-sm text-gray-500">{value.message}</p>
                      </div>
                      {value.isValid ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-1" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500 mt-1" />
                      )}
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Encryption Service</CardTitle>
                <CardDescription>Testing encryption and decryption functionality</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <p>{result.encryption.message}</p>
                  {result.encryption.isValid ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Google OAuth</CardTitle>
                <CardDescription>Testing Google OAuth credentials</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <p>{result.googleOAuth.message}</p>
                  {result.googleOAuth.isValid ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {debug && (
            <Card>
              <CardHeader>
                <CardTitle>Debug Information</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">{JSON.stringify(result, null, 2)}</pre>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}

function DatabaseCheck() {
  return <div>Database connection check...</div>
}

function ServicesCheck() {
  return <div>External services check...</div>
}
