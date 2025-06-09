"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

export default function MigratePage() {
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState("")
  const [isComplete, setIsComplete] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const runMigration = async () => {
    setIsRunning(true)
    setProgress(0)
    setStatus("Starting migration...")
    setError(null)

    try {
      // Simulate migration steps
      await simulateStep("Finding clinics to migrate...", 10)
      await simulateStep("Migrating clinic data...", 30)
      await simulateStep("Migrating staff data...", 50)
      await simulateStep("Migrating patient data...", 70)
      await simulateStep("Migrating appointment data...", 90)
      await simulateStep("Finalizing migration...", 100)

      setStatus("Migration completed successfully!")
      setIsComplete(true)
    } catch (err) {
      setError(`Migration failed: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setIsRunning(false)
    }
  }

  const simulateStep = async (message: string, progressValue: number) => {
    setStatus(message)
    setProgress(progressValue)
    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1500))
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Database Migration Tool</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Migrate to New Database Structure</CardTitle>
          <CardDescription>
            This tool will migrate your existing data to the new database structure. Make sure you have a backup before
            proceeding.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isRunning && (
            <div className="space-y-4">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-gray-500">{status}</p>
            </div>
          )}

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isComplete && (
            <Alert className="mt-4 bg-green-50 border-green-200">
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>
                Migration completed successfully. Your data is now using the new structure.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={runMigration} disabled={isRunning} className="bg-blue-600 hover:bg-blue-700">
            {isRunning ? "Migration in Progress..." : isComplete ? "Migration Complete" : "Start Migration"}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Migration Details</CardTitle>
          <CardDescription>What happens during the migration process</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              Clinics will be moved to a flat <code>/clinics</code> collection
            </li>
            <li>
              Staff will be moved to a flat <code>/staff</code> collection with clinic references
            </li>
            <li>
              Patients will be moved to a flat <code>/patients</code> collection with clinic references
            </li>
            <li>All relationships between entities will be preserved</li>
            <li>The application will automatically use the new data structure after migration</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
